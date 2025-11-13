import {
	BookMarked,
	BookOpen,
	CalendarRange,
	ChartLine,
	CheckCircle2,
	Compass,
	Feather,
	Flame,
	Lightbulb,
	ListTree,
	ScrollText,
	Settings,
	Users,
} from "lucide-react";
import type * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
  type TreeItem
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { Plus, ArrowUp, ArrowDown, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from "@/db/curd";
import type { ProjectInterface, ChapterInterface, SceneInterface } from "@/db/schema";
import { Link } from "@tanstack/react-router";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
	{
		label: "Workspace Overview",
		description: "Monitor the heart of your novel project",
		items: [
			{ icon: Compass, label: "Dashboard", note: "Project summary & stats" },
			{ icon: ChartLine, label: "Progress Analytics", note: "Word count trends" },
			{ icon: CalendarRange, label: "Writing Schedule", note: "Session planner" },
		],
	},
	{
		label: "Story Building",
		description: "Outline plotlines and manage narrative structure",
		items: [
			{ icon: ListTree, label: "Chapters & Scenes", note: "Hierarchy & beats" },
			{ icon: ScrollText, label: "Story Beats", note: "Acts, arcs, and pacing" },
			{ icon: BookMarked, label: "Story Bible", note: "Lore & continuity" },
		],
	},
	{
		label: "Creative Resources",
		description: "Keep research, references, and inspiration in reach",
		items: [
			{ icon: Users, label: "Characters", note: "Profiles & relationships" },
			{ icon: BookOpen, label: "World Atlas", note: "Locations & cultures" },
			{ icon: Lightbulb, label: "Inspiration Vault", note: "Prompts & snippets" },
		],
	},
	{
		label: "Productivity",
		description: "Stay consistent and celebrate milestones",
		items: [
			{ icon: Feather, label: "Daily Goals", note: "Word target & streak" },
			{ icon: Flame, label: "Focus Sessions", note: "Pomodoro & timers" },
			{ icon: CheckCircle2, label: "Milestones", note: "Draft checkpoints" },
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const projects = useLiveQuery<ProjectInterface[]>(() => db.getAllProjects(), []);
    const chapters = useLiveQuery<ChapterInterface[]>(() => db.getAllChapters(), []);
    const scenes = useLiveQuery<SceneInterface[]>(() => db.getAllScenes(), []);

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [chapterEditId, setChapterEditId] = useState<string | null>(null);
    const [chapterEditTitle, setChapterEditTitle] = useState("");
    const [sceneEditId, setSceneEditId] = useState<string | null>(null);
    const [sceneEditTitle, setSceneEditTitle] = useState("");
    const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

    const projectList = projects ?? [];
    const chapterList = (chapters ?? []).filter(c => !selectedProjectId || c.project === selectedProjectId).sort((a,b)=>a.order-b.order);
    const sceneList = (scenes ?? []).filter(s => !selectedChapterId || s.chapter === selectedChapterId).sort((a,b)=>a.order-b.order);

    const activeProjectId = useMemo(() => selectedProjectId ?? projectList[0]?.id ?? null, [selectedProjectId, projectList]);
    const visibleChapters = useMemo(() => (chapters ?? []).filter(c => c.project === activeProjectId).sort((a,b)=>a.order-b.order), [chapters, activeProjectId]);
    const activeChapterId = useMemo(() => selectedChapterId ?? visibleChapters[0]?.id ?? null, [selectedChapterId, visibleChapters]);
    const visibleScenes = useMemo(() => (scenes ?? []).filter(s => s.chapter === activeChapterId).sort((a,b)=>a.order-b.order), [scenes, activeChapterId]);

    const handleAddChapter = useCallback(async () => {
        if (!activeProjectId) { toast.error("请先创建项目"); return; }
        const nextOrder = visibleChapters.length ? Math.max(...visibleChapters.map(c=>c.order)) + 1 : 1;
        const newChapter = await db.addChapter({ project: activeProjectId, title: `Chapter ${nextOrder}`, order: nextOrder, open: false, showEdit: false });
        setSelectedChapterId(newChapter.id);
        toast.success("章节已创建");
    }, [activeProjectId, visibleChapters]);

    const handleAddScene = useCallback(async () => {
        if (!activeProjectId || !activeChapterId) { toast.error("请先选择章节"); return; }
        const nextOrder = visibleScenes.length ? Math.max(...visibleScenes.map(s=>s.order)) + 1 : 1;
        const newScene = await db.addScene({ project: activeProjectId, chapter: activeChapterId, title: `Scene ${nextOrder}`, order: nextOrder, content: JSON.stringify({}), showEdit: false });
        toast.success("场景已创建");
    }, [activeProjectId, activeChapterId, visibleScenes]);

    const commitChapterRename = useCallback(async () => {
        if (!chapterEditId) return;
        const title = chapterEditTitle.trim();
        if (!title) { toast.error("章节标题不能为空"); return; }
        await db.updateChapter(chapterEditId, { title });
        setChapterEditId(null);
        setChapterEditTitle("");
        toast.success("章节已重命名");
    }, [chapterEditId, chapterEditTitle]);

    const commitSceneRename = useCallback(async () => {
        if (!sceneEditId) return;
        const title = sceneEditTitle.trim();
        if (!title) { toast.error("场景标题不能为空"); return; }
        await db.updateScene(sceneEditId, { title });
        setSceneEditId(null);
        setSceneEditTitle("");
        toast.success("场景已重命名");
    }, [sceneEditId, sceneEditTitle]);

    const deleteChapter = useCallback(async (id:string) => {
        if (!window.confirm("确认删除章节？")) return;
        await db.deleteChapter(id);
        toast.success("章节已删除");
    }, []);

    const [ctxMenu, setCtxMenu] = useState<
        | { visible: true; x: number; y: number; type: "chapters" | "scenes" }
        | { visible: false }
    >({ visible: false });
    const deleteScene = useCallback(async (id:string) => {
        if (!window.confirm("确认删除场景？")) return;
        await db.deleteScene(id);
        toast.success("场景已删除");
    }, []);

    return (
        <Sidebar {...props}>
            
            <div className="relative" onClick={() => ctxMenu.visible && setCtxMenu({ visible: false })}>
                <SidebarContent>
                    {navigation.map((section) => (
                        <SidebarGroup key={section.label}>
                            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <p className="px-2 pb-2 text-xs text-muted-foreground">
                                    {section.description}
                                </p>
                                <SidebarMenu>
                                    {section.items.map((item) => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton tooltip={item.label}>
                                                <item.icon className="size-4" />
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                    <span className="text-xs text-muted-foreground">{item.note}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}

                    {/* Chapters & Scenes Management */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Chapters & Scenes</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-3">
                                {/* Project selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Project</span>
                                    <select
                                        className="h-8 w-full rounded-md border bg-background px-2 text-sm"
                                        value={activeProjectId ?? ""}
                                        onChange={(e)=>{ setSelectedProjectId(e.target.value || null); setSelectedChapterId(null);} }
                                    >
                                        {projectList.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                    <Button size="sm" variant="outline" onClick={handleAddChapter}><Plus className="mr-1 size-4"/>章节</Button>
                                </div>
                                {/* Tree: Chapters with nested Scenes (react-complex-tree) */}
                                <div
                                    className="rounded-md border"
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setCtxMenu({ visible: true, x: e.clientX, y: e.clientY, type: "chapters" });
                                    }}
                                >
                                    <div className="flex items-center justify-between border-b px-2 py-1.5">
                                        <span className="text-xs text-muted-foreground">Chapters</span>
                                        <Button size="sm" variant="ghost" onClick={handleAddChapter}><Plus className="mr-1 size-4"/>新增章节</Button>
                                    </div>
                                    <div className="max-h-72 overflow-auto p-1">
                                        {
                                            (() => {
                                                const items: Record<string, TreeItem> = { root: { index: "root", isFolder: true, children: [], data: { type: "root" } } };
                                                const chapterIds = visibleChapters.map((c) => `ch_${c.id}`);
                                                (items.root as any).children = chapterIds;
                                                visibleChapters.forEach((c) => {
                                                    const sc = (scenes ?? []).filter((s) => s.chapter === c.id).sort((a,b)=>a.order-b.order);
                                                    const sceneIds = sc.map((s) => `sc_${s.id}`);
                                                    items[`ch_${c.id}`] = {
                                                        index: `ch_${c.id}`,
                                                        isFolder: true,
                                                        children: sceneIds,
                                                        data: { type: "chapter", id: c.id, title: c.title },
                                                    };
                                                    sc.forEach((s) => {
                                                        items[`sc_${s.id}`] = {
                                                            index: `sc_${s.id}`,
                                                            isFolder: false,
                                                            children: [],
                                                            data: { type: "scene", id: s.id, title: s.title, chapter: s.chapter },
                                                        };
                                                    });
                                                });
                                                const provider = new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }));
                                                return (
                                                    <UncontrolledTreeEnvironment
                                                        dataProvider={provider}
                                                        getItemTitle={(item) => (item.data?.title as string) ?? ""}
                                                        viewState={{
                                                            "chapters-tree": {
                                                                expandedItems: ["root", ...chapterIds],
                                                                selectedItems: [],
                                                                focusedItem: "root",
                                                            },
                                                        }}
                                                        canDragAndDrop={false}
                                                        canReorderItems={false}
                                                        aria-label="Chapters tree"
                                                    >
                                                        <Tree
                                                            treeId="chapters-tree"
                                                            rootItem="root"
                                                            treeLabel="Chapters"
                                                        />
                                                    </UncontrolledTreeEnvironment>
                                                );
                                            })()
                                        }
                                    </div>
                                </div>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Footer Settings Link */}
                    <div className="p-2">
                        <Link to="/settings/design">
                            <Button variant="outline" className="w-full">设置</Button>
                        </Link>
                    </div>
                </SidebarContent>

                {/* Right-click Context Menu */}
                {ctxMenu.visible ? (
                    <div
                        className="absolute z-50 min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                        style={{ left: ctxMenu.x, top: ctxMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {ctxMenu.type === "chapters" ? (
                            <button
                                className="w-full select-none rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => { setCtxMenu({ visible: false }); handleAddChapter(); }}
                            >
                                新建章节
                            </button>
                        ) : null}
                        {ctxMenu.type === "scenes" ? (
                            <button
                                className="w-full select-none rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                                disabled={!activeChapterId}
                                onClick={() => { setCtxMenu({ visible: false }); handleAddScene(); }}
                            >
                                新建场景
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
            <SidebarRail />
        </Sidebar>
    );
}
