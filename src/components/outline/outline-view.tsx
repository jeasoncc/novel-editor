// 大纲视图主组件
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LayoutList,
	LayoutGrid,
	Clock,
	Network,
	Search,
	Plus,
	Settings,
} from "lucide-react";
import { OutlineTreeView } from "./outline-tree-view";
import { OutlineCardsView } from "./outline-cards-view";
import type { OutlineViewConfig } from "@/db/schema-outline";
import type { ProjectInterface, ChapterInterface, SceneInterface } from "@/db/schema";

interface OutlineViewProps {
	project: ProjectInterface;
	chapters: ChapterInterface[];
	scenes: SceneInterface[];
	onNavigateToScene?: (sceneId: string) => void;
}

export function OutlineView({
	project,
	chapters,
	scenes,
	onNavigateToScene,
}: OutlineViewProps) {
	const [viewMode, setViewMode] = useState<OutlineViewConfig["viewMode"]>("tree");
	const [searchQuery, setSearchQuery] = useState("");
	const [showWordCount, setShowWordCount] = useState(true);
	const [showStatus, setShowStatus] = useState(true);

	// 过滤数据
	const filteredChapters = useMemo(() => {
		if (!searchQuery) return chapters;
		const query = searchQuery.toLowerCase();
		return chapters.filter((ch) =>
			ch.title.toLowerCase().includes(query)
		);
	}, [chapters, searchQuery]);

	const filteredScenes = useMemo(() => {
		if (!searchQuery) return scenes;
		const query = searchQuery.toLowerCase();
		return scenes.filter((sc) =>
			sc.title.toLowerCase().includes(query)
		);
	}, [scenes, searchQuery]);

	return (
		<div className="flex flex-col h-full">
			{/* 顶部工具栏 */}
			<div className="flex items-center gap-2 p-4 border-b">
				<h2 className="text-lg font-semibold flex-1">大纲视图</h2>
				
				{/* 视图切换 */}
				<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
					<TabsList className="grid grid-cols-2 w-[200px]">
						<TabsTrigger value="tree" className="gap-1.5">
							<LayoutList className="size-4" />
							<span>树形</span>
						</TabsTrigger>
						<TabsTrigger value="cards" className="gap-1.5">
							<LayoutGrid className="size-4" />
							<span>卡片</span>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* 搜索栏 */}
			<div className="flex items-center gap-2 p-4 border-b">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="搜索章节、场景..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Button variant="outline" size="icon">
					<Settings className="size-4" />
				</Button>
			</div>

			{/* 视图内容 */}
			<ScrollArea className="flex-1">
				<div className="p-4">
					{viewMode === "tree" && (
						<OutlineTreeView
							project={project}
							chapters={filteredChapters}
							scenes={filteredScenes}
							showWordCount={showWordCount}
							showStatus={showStatus}
							onNavigateToScene={onNavigateToScene}
						/>
					)}
					{viewMode === "cards" && (
						<OutlineCardsView
							project={project}
							chapters={filteredChapters}
							scenes={filteredScenes}
							onNavigateToScene={onNavigateToScene}
						/>
					)}
				</div>
			</ScrollArea>

			{/* 底部统计 */}
			<div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
				<span>
					共 {chapters.length} 章节 · {scenes.length} 场景
				</span>
				<span>
					总字数: {calculateTotalWords(scenes)}
				</span>
			</div>
		</div>
	);
}

function calculateTotalWords(scenes: SceneInterface[]): string {
	// 简单的字数统计逻辑，实际需要解析 content
	const total = scenes.reduce((sum, scene) => {
		if (typeof scene.content === "string") {
			return sum + scene.content.length;
		}
		return sum;
	}, 0);
	return total.toLocaleString();
}

