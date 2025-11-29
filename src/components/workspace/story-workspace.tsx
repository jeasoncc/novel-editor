//
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/rich-editor/editor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Settings, MoreHorizontal, Trash2, ChevronRight, Home, FileText } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
//
import { db } from "@/db/curd";
import type {
	ChapterInterface,
	ProjectInterface,
	SceneInterface,
} from "@/db/schema";
import { toast } from "sonner";
import { StoryRightSidebar } from "@/components/story-right-sidebar";
import { useConfirm } from "@/components/ui/confirm";
import { useSelectionStore, type SelectionState } from "@/stores/selection";
import { useOutlineStore } from "@/stores/outline";
import { useSettings } from "@/hooks/use-settings";
import { createBook, exportAll, importFromJson, readFileAsText, triggerDownload } from "@/services/projects";
import { openCreateBookDialog } from "@/components/blocks/createBookDialog";
//

import { countWords, extractTextFromSerialized } from "@/lib/statistics";

interface StoryWorkspaceProps {
	projects: ProjectInterface[];
	chapters: ChapterInterface[];
	scenes: SceneInterface[];
	activeProjectId?: string;
	onCreateProject?: () => void;
}

// 默认自动保存延迟（毫秒）
const DEFAULT_AUTO_SAVE_MS = 800;

export function StoryWorkspace({
	projects,
	chapters,
	scenes,
	activeProjectId,
	onCreateProject,
}: StoryWorkspaceProps) {
	const initialProjectId = activeProjectId ?? projects[0]?.id ?? null;
	const selectedProjectId = useSelectionStore((s: SelectionState) => s.selectedProjectId);
	const setSelectedProjectId = useSelectionStore((s: SelectionState) => s.setSelectedProjectId);
	const selectedChapterId = useSelectionStore((s: SelectionState) => s.selectedChapterId);
	const setSelectedChapterId = useSelectionStore((s: SelectionState) => s.setSelectedChapterId);
	const selectedSceneId = useSelectionStore((s: SelectionState) => s.selectedSceneId);
	const setSelectedSceneId = useSelectionStore((s: SelectionState) => s.setSelectedSceneId);

	// 获取自动保存设置
	const { autoSave, autoSaveInterval } = useSettings();
	// 计算自动保存延迟（设置中是秒，转换为毫秒，最小800ms）
	const autoSaveDelayMs = autoSave ? Math.max(DEFAULT_AUTO_SAVE_MS, autoSaveInterval * 1000) : DEFAULT_AUTO_SAVE_MS;

	const [chapterEditId, setChapterEditId] = useState<string | null>(null);
	const [chapterEditTitle, setChapterEditTitle] = useState("");
	const [sceneEditId, setSceneEditId] = useState<string | null>(null);
	const [sceneEditTitle, setSceneEditTitle] = useState("");

	const [editorInitialState, setEditorInitialState] =
		useState<SerializedEditorState>();
	const [sceneWordCount, setSceneWordCount] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
    const confirm = useConfirm();

	// bottom dock actions
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleExport = useCallback(async () => {
		try {
			const json = await exportAll();
			triggerDownload(`novel-editor-backup-${new Date().toISOString().slice(0,10)}.json`, json);
			toast.success("导出成功");
		} catch (err) {
			toast.error("导出失败");
		}
	}, []);

	const handleImportClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const text = await readFileAsText(file);
			await importFromJson(text, { keepIds: false });
			toast.success("导入成功");
		} catch (err) {
			toast.error("导入失败");
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}, []);

	const handleQuickCreate = useCallback(async () => {
		const data = await openCreateBookDialog();
		if (!data) return;
		try {
			await createBook({ title: data.title, author: data.author, description: data.description ?? "" });
			toast.success(`已创建书籍：${data.title}`);
		} catch (e) {
			// createBook 内部包含失败处理
		}
	}, []);

	const handleDeleteAllBooks = useCallback(async () => {
		const ok = await confirm({ title: "确认删除所有书籍？", description: "该操作不可恢复，将清空书籍、章节、场景与附件。", confirmText: "删除", cancelText: "取消" });
		if (!ok) return;
		try {
			await Promise.all([
				db.attachments.clear(),
				db.roles.clear(),
				db.scenes.clear(),
				db.chapters.clear(),
				db.projects.clear(),
			]);
			toast.success("已删除所有书籍");
		} catch (err) {
			toast.error("删除失败，请重试");
		}
	}, []);

	// sync props data into outline store for global consumption
	const setProjectsStore = useOutlineStore((s) => s.setProjects);
	const setChaptersStore = useOutlineStore((s) => s.setChapters);
	const setScenesStore = useOutlineStore((s) => s.setScenes);
	useEffect(() => {
		setProjectsStore(projects);
	}, [projects, setProjectsStore]);
	useEffect(() => {
		setChaptersStore(chapters);
	}, [chapters, setChaptersStore]);
	useEffect(() => {
		setScenesStore(scenes);
	}, [scenes, setScenesStore]);

	// keep project selection in sync with external changes
	useEffect(() => {
		if (!selectedProjectId && initialProjectId) {
			setSelectedProjectId(initialProjectId);
		}
		if (activeProjectId && activeProjectId !== selectedProjectId) {
			setSelectedProjectId(activeProjectId);
		}
	}, [activeProjectId, selectedProjectId, initialProjectId, setSelectedProjectId]);

	useEffect(() => {
		if (!selectedProjectId && projects.length) {
			setSelectedProjectId(projects[0].id);
		}
		if (
			selectedProjectId &&
			!projects.some((project) => project.id === selectedProjectId) &&
			projects.length
		) {
			setSelectedProjectId(projects[0].id);
		}
	}, [projects, selectedProjectId, setSelectedProjectId]);

	const projectChapters = useMemo(
		() =>
			chapters
				.filter((chapter) => chapter.project === selectedProjectId)
				.sort((a, b) => a.order - b.order),
		[chapters, selectedProjectId],
	);

	useEffect(() => {
		if (!projectChapters.length) {
			setSelectedChapterId(null);
			return;
		}
		if (
			!selectedChapterId ||
			!projectChapters.some((chapter) => chapter.id === selectedChapterId)
		) {
			setSelectedChapterId(projectChapters[0].id);
		}
	}, [projectChapters, selectedChapterId, setSelectedChapterId]);

	const chapterScenes = useMemo(
		() =>
			scenes
				.filter((scene) => scene.chapter === selectedChapterId)
				.sort((a, b) => a.order - b.order),
		[scenes, selectedChapterId],
	);

	useEffect(() => {
		if (!chapterScenes.length) {
			setSelectedSceneId(null);
			return;
		}
		if (
			!selectedSceneId ||
			!chapterScenes.some((scene) => scene.id === selectedSceneId)
		) {
			setSelectedSceneId(chapterScenes[0].id);
		}
	}, [chapterScenes, selectedSceneId, setSelectedSceneId]);

	const activeScene = useMemo(
		() => chapterScenes.find((scene) => scene.id === selectedSceneId) ?? null,
		[chapterScenes, selectedSceneId],
	);

	useEffect(() => {
		if (!activeScene) {
			setEditorInitialState(undefined);
			setSceneWordCount(0);
			return;
		}
		const initial = parseSceneContent(activeScene);
		setEditorInitialState(initial);
		const text = extractTextFromSerialized(initial);
		setSceneWordCount(countWords(text));
	}, [activeScene?.id]);

	const debouncedSave = useMemo(
		() =>
			debounce(
				async (sceneId: string, serialized: SerializedEditorState) => {
					if (!autoSave) return; // 如果禁用自动保存，不执行
					setIsSaving(true);
					try {
						await db.updateScene(sceneId, {
							content: JSON.stringify(serialized),
						});
					} catch (error) {
						loggerError("Failed to save scene", error);
						toast.error("保存场景内容失败");
					} finally {
						setIsSaving(false);
					}
				},
				autoSaveDelayMs,
			),
		[autoSave, autoSaveDelayMs],
	);

	useEffect(
		() => () => {
			debouncedSave.cancel();
		},
		[debouncedSave],
	);

	const handleSerializedChange = useCallback(
		(serialized: SerializedEditorState) => {
			if (!activeScene) return;
            const text = extractTextFromSerialized(serialized);
			setSceneWordCount(countWords(text));
			debouncedSave(activeScene.id, serialized);
		},
		[activeScene, debouncedSave],
	);

	const projectStats = useMemo(() => {
		const targetProject = projects.find(
			(project) => project.id === selectedProjectId,
		);
		if (!targetProject) {
			return {
				chapterCount: 0,
				sceneCount: 0,
				wordCount: 0,
				lastEdited: undefined as string | undefined,
				streak: 0,
			};
		}

		const relatedScenes = scenes
			.filter((scene) => scene.project === targetProject.id)
			.sort(
				(a, b) => new Date(b.lastEdit).getTime() - new Date(a.lastEdit).getTime(),
			);

		return {
			chapterCount: projectChapters.length,
			sceneCount: relatedScenes.length,
			wordCount: relatedScenes.reduce(
				(sum, scene) => sum + countSceneWords(scene),
				0,
			),
			lastEdited: relatedScenes[0]?.lastEdit,
			streak: computeStreak(relatedScenes.map((scene) => scene.lastEdit)),
		};
	}, [projectChapters, projects, scenes, selectedProjectId]);

	const handleAddChapter = useCallback(async () => {
		if (!selectedProjectId) return;
		try {
			const nextOrder =
				projectChapters.length > 0
					? Math.max(...projectChapters.map((chapter) => chapter.order)) + 1
					: 1;
			const newChapter = await db.addChapter({
				project: selectedProjectId,
				title: `Chapter ${nextOrder}`,
				order: nextOrder,
				open: false,
				showEdit: false,
			});
			setSelectedChapterId(newChapter.id);
			toast.success("章节已创建");
		} catch (error) {
			loggerError("Failed to add chapter", error);
			toast.error("创建章节失败");
		}
	}, [projectChapters, selectedProjectId, setSelectedChapterId]);

	const handleDeleteChapter = useCallback(
		async (chapterId: string) => {
			const target = projectChapters.find((chapter) => chapter.id === chapterId);
			if (!target) return;
			const ok = await confirm({ title: "删除章节？", description: `确认删除章节 “${target.title}” 吗？该操作不可撤销。`, confirmText: "删除", cancelText: "取消" });
			if (!ok) return;
			try {
				await db.deleteChapter(chapterId);
				toast.success("章节已删除");
			} catch (error) {
				loggerError("Failed to delete chapter", error);
				toast.error("删除章节失败");
			}
		},
		[projectChapters],
	);

	const handleChapterReorder = useCallback(
		async (chapterId: string, direction: "up" | "down") => {
			const sorted = [...projectChapters];
			const index = sorted.findIndex((chapter) => chapter.id === chapterId);
			if (index === -1) return;
			const swapIndex = direction === "up" ? index - 1 : index + 1;
			if (swapIndex < 0 || swapIndex >= sorted.length) return;

			const current = sorted[index];
			const target = sorted[swapIndex];

			try {
				await Promise.all([
					db.updateChapter(current.id, { order: target.order }),
					db.updateChapter(target.id, { order: current.order }),
				]);
				toast.success("章节顺序已更新");
			} catch (error) {
				loggerError("Failed to reorder chapter", error);
				toast.error("更新章节顺序失败");
			}
		},
		[projectChapters],
	);

	const commitChapterRename = useCallback(async () => {
		if (!chapterEditId) return;
		const title = chapterEditTitle.trim();
		if (!title) {
			toast.error("章节标题不能为空");
			return;
		}
		try {
			await db.updateChapter(chapterEditId, { title });
			toast.success("章节已重命名");
			setChapterEditId(null);
			setChapterEditTitle("");
		} catch (error) {
			loggerError("Failed to rename chapter", error);
			toast.error("章节重命名失败");
		}
	}, [chapterEditId, chapterEditTitle]);

	const handleAddScene = useCallback(async () => {
		if (!selectedChapterId || !selectedProjectId) {
			toast.error("请先选择章节");
			return;
		}
		try {
			const nextOrder =
				chapterScenes.length > 0
					? Math.max(...chapterScenes.map((scene) => scene.order)) + 1
					: 1;
			const newScene = await db.addScene({
				project: selectedProjectId,
				chapter: selectedChapterId,
				title: `Scene ${nextOrder}`,
				order: nextOrder,
				content: JSON.stringify(createLexicalState()),
				showEdit: false,
			});
			setSelectedSceneId(newScene.id);
			toast.success("场景已创建");
		} catch (error) {
			loggerError("Failed to add scene", error);
			toast.error("创建场景失败");
		}
	}, [chapterScenes, selectedChapterId, selectedProjectId, setSelectedSceneId]);

	const handleDeleteScene = useCallback(
		async (sceneId: string) => {
			const target = chapterScenes.find((scene) => scene.id === sceneId);
			if (!target) return;
			const ok = await confirm({ title: "删除场景？", description: `确认删除场景 “${target.title}” 吗？该操作不可撤销。`, confirmText: "删除", cancelText: "取消" });
			if (!ok) return;
			try {
				await db.deleteScene(sceneId);
				toast.success("场景已删除");
			} catch (error) {
				loggerError("Failed to delete scene", error);
				toast.error("删除场景失败");
			}
		},
		[chapterScenes],
	);

	const handleSceneReorder = useCallback(
		async (sceneId: string, direction: "up" | "down") => {
			const sorted = [...chapterScenes];
			const index = sorted.findIndex((scene) => scene.id === sceneId);
			if (index === -1) return;
			const swapIndex = direction === "up" ? index - 1 : index + 1;
			if (swapIndex < 0 || swapIndex >= sorted.length) return;

			const current = sorted[index];
			const target = sorted[swapIndex];

			try {
				await Promise.all([
					db.updateScene(current.id, { order: target.order }),
					db.updateScene(target.id, { order: current.order }),
				]);
				toast.success("场景顺序已更新");
			} catch (error) {
				loggerError("Failed to reorder scene", error);
				toast.error("更新场景顺序失败");
			}
		},
		[chapterScenes],
	);

	const commitSceneRename = useCallback(async () => {
		if (!sceneEditId) return;
		const title = sceneEditTitle.trim();
		if (!title) {
			toast.error("场景标题不能为空");
			return;
		}
		try {
			await db.updateScene(sceneEditId, { title });
			toast.success("场景已重命名");
			setSceneEditId(null);
			setSceneEditTitle("");
		} catch (error) {
			loggerError("Failed to rename scene", error);
			toast.error("场景重命名失败");
		}
	}, [sceneEditId, sceneEditTitle]);

    // Current Context Data for Breadcrumb
    const currentProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);
    const currentChapter = useMemo(() => chapters.find(c => c.id === selectedChapterId), [chapters, selectedChapterId]);
    const currentScene = useMemo(() => scenes.find(s => s.id === selectedSceneId), [scenes, selectedSceneId]);

	return (
		<TooltipProvider>
			<div className="flex h-screen bg-background text-foreground">
				<main className="flex-1 flex flex-col overflow-hidden relative bg-background/50">
                    {/* Top Header / Breadcrumb */}
                    <header className="h-12 flex items-center px-6 border-b border-border/40 bg-background/95 backdrop-blur z-10 shrink-0">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium">
                                       <Home className="size-3.5" />
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink className={`font-medium ${!currentChapter ? 'text-foreground' : ''}`}>
                                        {currentProject?.title || "Select Project"}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentChapter && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                             <BreadcrumbLink className={`font-medium ${!currentScene ? 'text-foreground' : ''}`}>
                                                {currentChapter.title}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                                {currentScene && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="font-semibold text-primary">
                                                {currentScene.title}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        
                        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                            {isSaving && <span className="animate-pulse text-primary">Saving...</span>}
                            {!isSaving && <span>Saved</span>}
                        </div>
                    </header>

					<div className="flex-1 overflow-hidden relative w-full max-w-5xl mx-auto">
						<div className="h-full w-full overflow-y-auto px-8 py-8 scroll-smooth">
                            {/* Editor Container */}
							<article className="min-h-[calc(100%-4rem)] w-full max-w-3xl mx-auto bg-card shadow-sm border border-border/50 rounded-lg overflow-hidden relative pb-20">
								{editorInitialState && selectedSceneId ? (
										<div className="p-8 sm:p-12 min-h-[600px] font-editor text-lg leading-relaxed text-card-foreground">
												<Editor
														key={selectedSceneId}
														editorSerializedState={editorInitialState}
														onSerializedChange={handleSerializedChange}
												/>
										</div>
								) : (
									<div className="flex h-full min-h-[400px] items-center justify-center text-sm text-muted-foreground flex-col gap-2">
                                        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                                            <FileText className="size-6 text-muted-foreground/50" />
                                        </div>
										<p>Select a scene from the sidebar to start writing.</p>
									</div>
								)}
							</article>
						</div>
					</div>

                    {/* Minimal Footer Status Bar */}
					<footer className="h-8 border-t border-border/40 bg-background/80 backdrop-blur text-[11px] text-muted-foreground flex items-center justify-between px-4 shrink-0 z-20">
                        <div className="flex items-center gap-3">
                           <span>Words: <strong className="text-foreground font-medium">{projectStats.wordCount.toLocaleString()}</strong> total</span>
                           <span className="w-px h-3 bg-border" />
                           <span>Current Scene: <strong className="text-foreground font-medium">{sceneWordCount.toLocaleString()}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            {projectStats.lastEdited && <span>Last edited {formatRelativeTime(projectStats.lastEdited)}</span>}
                        </div>
                    </footer>
				</main>
				{/* Right-side Sidebar for Chapters & Scenes */}
				<StoryRightSidebar />
				{/* <OutlineSidebar /> */}
			</div>
		</TooltipProvider>
	);
}

function loggerError(message: string, error: unknown) {
	if (error instanceof Error) {
		console.error(message, error);
	} else {
		console.error(message);
	}
}

function parseSceneContent(scene: SceneInterface | null): SerializedEditorState {
	if (!scene || !scene.content) {
		return createLexicalState();
	}

	const raw = scene.content;
	if (typeof raw === "object" && raw !== null && "root" in raw) {
		return raw as SerializedEditorState;
	}

	if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (!trimmed) {
			return createLexicalState();
		}
		try {
			const parsed = JSON.parse(trimmed);
			if (parsed && typeof parsed === "object" && "root" in parsed) {
				return parsed as SerializedEditorState;
			}
		} catch {
			return createLexicalState(trimmed);
		}
		return createLexicalState(trimmed);
	}

	return createLexicalState(
		typeof raw === "string" ? raw : JSON.stringify(raw ?? ""),
	);
}

function createLexicalState(text = ""): SerializedEditorState {
	const paragraphChildren =
		text.length > 0
			? [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text,
						type: "text",
						version: 1,
					},
				]
			: [];

	return {
		root: {
			children: [
				{
					children: paragraphChildren,
					direction: "ltr",
					format: "",
					indent: 0,
					type: "paragraph",
					version: 1,
				},
			],
			direction: "ltr",
			format: "",
			indent: 0,
			type: "root",
			version: 1,
		},
	} as unknown as SerializedEditorState;
}

function countSceneWords(scene: SceneInterface): number {
	try {
        const state = parseSceneContent(scene);
        const text = extractTextFromSerialized(state);
		return countWords(text);
	} catch {
		if (typeof scene.content === "string") {
			return countWords(scene.content);
		}
		return 0;
	}
}

function computeStreak(timestamps: string[]): number {
	if (!timestamps.length) return 0;
	const uniqueDays = new Set(
		timestamps
			.map((iso) => {
				const date = new Date(iso);
				return Number.isNaN(date.getTime())
					? null
					: date.toISOString().slice(0, 10);
			})
			.filter(Boolean) as string[],
	);

	let streak = 0;
	const today = new Date();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const target = new Date(today);
		target.setDate(today.getDate() - streak);
		const key = target.toISOString().slice(0, 10);
		if (uniqueDays.has(key)) {
			streak += 1;
		} else {
			break;
		}
	}
	return streak;
}

function formatRelativeTime(iso?: string): string {
	if (!iso) return "No activity";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "Unknown";
	const diffMs = Date.now() - date.getTime();
	if (diffMs < 0) return "Just now";

	const minute = 60_000;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 365 * day;

	if (diffMs < minute) return "Just now";
	if (diffMs < hour) {
		const value = Math.round(diffMs / minute);
		return `${value} minute${value > 1 ? "s" : ""} ago`;
	}
	if (diffMs < day) {
		const value = Math.round(diffMs / hour);
		return `${value} hour${value > 1 ? "s" : ""} ago`;
	}
	if (diffMs < month) {
		const value = Math.round(diffMs / day);
		return `${value} day${value > 1 ? "s" : ""} ago`;
	}
	if (diffMs < year) {
		const value = Math.round(diffMs / month);
		return `${value} month${value > 1 ? "s" : ""} ago`;
	}
	const value = Math.round(diffMs / year);
	return `${value} year${value > 1 ? "s" : ""} ago`;
}

function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	const debounced = (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};

	debounced.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
}


