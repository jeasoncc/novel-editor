// 卡片视图组件（Scrivener 风格）
import { useMemo } from "react";
import { FileText, MoreVertical, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProjectInterface, ChapterInterface, SceneInterface } from "@/db/schema";
import { countWords, extractTextFromSerialized } from "@/lib/statistics";

interface OutlineCardsViewProps {
	project: ProjectInterface;
	chapters: ChapterInterface[];
	scenes: SceneInterface[];
	onNavigateToScene?: (sceneId: string) => void;
}

export function OutlineCardsView({
	chapters,
	scenes,
	onNavigateToScene,
}: OutlineCardsViewProps) {
	return (
		<div className="space-y-8">
			{chapters
				.sort((a, b) => a.order - b.order)
				.map((chapter) => {
					const chapterScenes = scenes
						.filter((s) => s.chapter === chapter.id)
						.sort((a, b) => a.order - b.order);

					return (
						<ChapterCardGroup
							key={chapter.id}
							chapter={chapter}
							scenes={chapterScenes}
							onNavigateToScene={onNavigateToScene}
						/>
					);
				})}
		</div>
	);
}

interface ChapterCardGroupProps {
	chapter: ChapterInterface;
	scenes: SceneInterface[];
	onNavigateToScene?: (sceneId: string) => void;
}

function ChapterCardGroup({
	chapter,
	scenes,
	onNavigateToScene,
}: ChapterCardGroupProps) {
	return (
		<div>
			{/* 章节标题 */}
			<div className="flex items-center gap-2 mb-4">
				<h3 className="text-lg font-semibold">{chapter.title}</h3>
				<Badge variant="secondary">{scenes.length} 场景</Badge>
			</div>

			{/* 场景卡片网格 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{scenes.map((scene) => (
					<SceneCard
						key={scene.id}
						scene={scene}
						onNavigate={onNavigateToScene}
					/>
				))}
			</div>
		</div>
	);
}

interface SceneCardProps {
	scene: SceneInterface;
	onNavigate?: (sceneId: string) => void;
}

function SceneCard({ scene, onNavigate }: SceneCardProps) {
	const { wordCount, excerpt } = useMemo(() => {
		try {
			const content = typeof scene.content === "string" 
				? JSON.parse(scene.content) 
				: scene.content;
			const text = extractTextFromSerialized(content);
			return {
				wordCount: countWords(text),
				excerpt: text.slice(0, 100) + (text.length > 100 ? "..." : ""),
			};
		} catch {
			return { wordCount: 0, excerpt: "" };
		}
	}, [scene.content]);

	const handleClick = () => {
		if (onNavigate) {
			onNavigate(scene.id);
		}
	};

	return (
		<Card
			className={cn(
				"group cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
				wordCount === 0 && "border-dashed opacity-60"
			)}
			onClick={handleClick}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start gap-2">
					<div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mt-1">
						<GripVertical className="size-4 text-muted-foreground" />
					</div>
					<FileText className="size-4 text-muted-foreground mt-1 shrink-0" />
					<div className="flex-1 min-w-0">
						<CardTitle className="text-base truncate">{scene.title}</CardTitle>
						<CardDescription className="text-xs mt-1">
							{wordCount.toLocaleString()} 字
						</CardDescription>
					</div>
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
							<DropdownMenuItem>编辑</DropdownMenuItem>
							<DropdownMenuItem>移动</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								删除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			{excerpt && (
				<CardContent>
					<p className="text-xs text-muted-foreground line-clamp-3">
						{excerpt}
					</p>
				</CardContent>
			)}
		</Card>
	);
}

