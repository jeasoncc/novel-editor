// 树形大纲视图组件
import { useState, useMemo } from "react";
import {
	ChevronDown,
	ChevronRight,
	FileText,
	MoreVertical,
	Plus,
	GripVertical,
	Circle,
	CheckCircle2,
	AlertCircle,
	Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProjectInterface, ChapterInterface, SceneInterface } from "@/db/schema";
import { countWords, extractTextFromSerialized } from "@/lib/statistics";

interface OutlineTreeViewProps {
	project: ProjectInterface;
	chapters: ChapterInterface[];
	scenes: SceneInterface[];
	showWordCount?: boolean;
	showStatus?: boolean;
	onNavigateToScene?: (sceneId: string) => void;
}

export function OutlineTreeView({
	chapters,
	scenes,
	showWordCount = true,
	showStatus = true,
	onNavigateToScene,
}: OutlineTreeViewProps) {
	const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
		new Set(chapters.map((ch) => ch.id))
	);

	const toggleChapter = (chapterId: string) => {
		setExpandedChapters((prev) => {
			const next = new Set(prev);
			if (next.has(chapterId)) {
				next.delete(chapterId);
			} else {
				next.add(chapterId);
			}
			return next;
		});
	};

	return (
		<div className="space-y-1">
			{chapters
				.sort((a, b) => a.order - b.order)
				.map((chapter) => {
					const chapterScenes = scenes
						.filter((s) => s.chapter === chapter.id)
						.sort((a, b) => a.order - b.order);
					const isExpanded = expandedChapters.has(chapter.id);

					return (
						<ChapterNode
							key={chapter.id}
							chapter={chapter}
							scenes={chapterScenes}
							isExpanded={isExpanded}
							onToggle={() => toggleChapter(chapter.id)}
							showWordCount={showWordCount}
							showStatus={showStatus}
							onNavigateToScene={onNavigateToScene}
						/>
					);
				})}
		</div>
	);
}

interface ChapterNodeProps {
	chapter: ChapterInterface;
	scenes: SceneInterface[];
	isExpanded: boolean;
	onToggle: () => void;
	showWordCount?: boolean;
	showStatus?: boolean;
	onNavigateToScene?: (sceneId: string) => void;
}

function ChapterNode({
	chapter,
	scenes,
	isExpanded,
	onToggle,
	showWordCount,
	onNavigateToScene,
}: ChapterNodeProps) {
	const chapterWordCount = useMemo(() => {
		return scenes.reduce((sum, scene) => {
			try {
				const content = typeof scene.content === "string" 
					? JSON.parse(scene.content) 
					: scene.content;
				const text = extractTextFromSerialized(content);
				return sum + countWords(text);
			} catch {
				return sum;
			}
		}, 0);
	}, [scenes]);

	return (
		<div className="group">
			{/* 章节行 */}
			<div
				className={cn(
					"flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors",
					"border border-transparent hover:border-border"
				)}
			>
				{/* 拖拽手柄 */}
				<div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
					<GripVertical className="size-4 text-muted-foreground" />
				</div>

				{/* 展开/折叠按钮 */}
				<Button
					variant="ghost"
					size="icon"
					className="size-6 shrink-0"
					onClick={onToggle}
				>
					{isExpanded ? (
						<ChevronDown className="size-4" />
					) : (
						<ChevronRight className="size-4" />
					)}
				</Button>

				{/* 章节标题 */}
				<div className="flex-1 min-w-0">
					<div className="font-medium truncate">{chapter.title}</div>
					<div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
						<span>{scenes.length} 场景</span>
						{showWordCount && (
							<>
								<span>·</span>
								<span>{chapterWordCount.toLocaleString()} 字</span>
							</>
						)}
					</div>
				</div>

				{/* 操作菜单 */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<MoreVertical className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Plus className="size-4 mr-2" />
							添加场景
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Edit3 className="size-4 mr-2" />
							重命名
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							删除章节
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* 场景列表 */}
			{isExpanded && scenes.length > 0 && (
				<div className="ml-8 mt-1 space-y-1">
					{scenes.map((scene) => (
						<SceneNode
							key={scene.id}
							scene={scene}
							showWordCount={showWordCount}
							onNavigate={onNavigateToScene}
						/>
					))}
				</div>
			)}
		</div>
	);
}

interface SceneNodeProps {
	scene: SceneInterface;
	showWordCount?: boolean;
	onNavigate?: (sceneId: string) => void;
}

function SceneNode({ scene, showWordCount, onNavigate }: SceneNodeProps) {
	const sceneWordCount = useMemo(() => {
		try {
			const content = typeof scene.content === "string" 
				? JSON.parse(scene.content) 
				: scene.content;
			const text = extractTextFromSerialized(content);
			return countWords(text);
		} catch {
			return 0;
		}
	}, [scene.content]);

	const handleClick = () => {
		if (onNavigate) {
			onNavigate(scene.id);
		}
	};

	return (
		<div
			className={cn(
				"group flex items-center gap-2 p-2 pl-4 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
				"border border-transparent hover:border-border"
			)}
			onClick={handleClick}
		>
			{/* 拖拽手柄 */}
			<div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
				<GripVertical className="size-4 text-muted-foreground" />
			</div>

			{/* 场景图标 */}
			<FileText className="size-4 text-muted-foreground shrink-0" />

			{/* 场景标题 */}
			<div className="flex-1 min-w-0">
				<div className="text-sm truncate">{scene.title}</div>
				{showWordCount && (
					<div className="text-xs text-muted-foreground mt-0.5">
						{sceneWordCount.toLocaleString()} 字
					</div>
				)}
			</div>

			{/* 状态图标 */}
			<div className="opacity-0 group-hover:opacity-100 transition-opacity">
				{sceneWordCount === 0 ? (
					<Circle className="size-4 text-muted-foreground" />
				) : (
					<CheckCircle2 className="size-4 text-green-500" />
				)}
			</div>

			{/* 操作菜单 */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
					<Button
						variant="ghost"
						size="icon"
						className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<MoreVertical className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>
						<Edit3 className="size-4 mr-2" />
						重命名
					</DropdownMenuItem>
					<DropdownMenuItem>复制</DropdownMenuItem>
					<DropdownMenuItem>移动到...</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						删除场景
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

