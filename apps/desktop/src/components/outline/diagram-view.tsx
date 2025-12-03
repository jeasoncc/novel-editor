/**
 * 大纲图表视图
 * 集成多种 PlantUML 图表类型
 */

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChapterInterface, SceneInterface } from "@/db/schema";
import type { RoleInterface } from "@/db/schema";
import { PlantUMLViewer } from "./plantuml-viewer";
import {
	generateChapterStructure,
	generateChapterFlow,
	generateCharacterRelations,
	generateTimeline,
	generateThreeActStructure,
	generateGanttChart,
} from "@/lib/plantuml-generator";

interface DiagramViewProps {
	chapters: ChapterInterface[];
	scenes: SceneInterface[];
	characters?: RoleInterface[];
}

export function DiagramView({
	chapters,
	scenes,
	characters = [],
}: DiagramViewProps) {
	const [activeTab, setActiveTab] = useState("structure");

	// 生成各种图表代码
	const structureCode = useMemo(
		() => generateChapterStructure(chapters, scenes),
		[chapters, scenes]
	);

	const flowCode = useMemo(
		() => generateChapterFlow(chapters),
		[chapters]
	);

	const threeActCode = useMemo(
		() => generateThreeActStructure(chapters),
		[chapters]
	);

	const timelineCode = useMemo(
		() => generateTimeline(chapters),
		[chapters]
	);

	const ganttCode = useMemo(
		() => generateGanttChart(chapters),
		[chapters]
	);

	const characterCode = useMemo(
		() => generateCharacterRelations(characters),
		[characters]
	);

	if (chapters.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground">
				<div className="text-center">
					<p className="text-lg mb-2">暂无章节数据</p>
					<p className="text-sm">创建章节后即可查看图表</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
				<div className="border-b px-4">
					<TabsList className="h-10">
						<TabsTrigger value="structure" className="text-xs">
							结构图
						</TabsTrigger>
						<TabsTrigger value="flow" className="text-xs">
							流程图
						</TabsTrigger>
						<TabsTrigger value="three-act" className="text-xs">
							三幕结构
						</TabsTrigger>
						<TabsTrigger value="timeline" className="text-xs">
							时间线
						</TabsTrigger>
						<TabsTrigger value="gantt" className="text-xs">
							进度图
						</TabsTrigger>
						{characters.length > 0 && (
							<TabsTrigger value="characters" className="text-xs">
								角色关系
							</TabsTrigger>
						)}
					</TabsList>
				</div>

				<div className="flex-1 overflow-hidden">
					<TabsContent value="structure" className="h-full m-0">
						<PlantUMLViewer
							code={structureCode}
							title="章节结构图"
							className="h-full"
						/>
					</TabsContent>

					<TabsContent value="flow" className="h-full m-0">
						<PlantUMLViewer
							code={flowCode}
							title="章节流程图"
							className="h-full"
						/>
					</TabsContent>

					<TabsContent value="three-act" className="h-full m-0">
						<PlantUMLViewer
							code={threeActCode}
							title="三幕结构图"
							className="h-full"
						/>
					</TabsContent>

					<TabsContent value="timeline" className="h-full m-0">
						<PlantUMLViewer
							code={timelineCode}
							title="故事时间线"
							className="h-full"
						/>
					</TabsContent>

					<TabsContent value="gantt" className="h-full m-0">
						<PlantUMLViewer
							code={ganttCode}
							title="创作进度图"
							className="h-full"
						/>
					</TabsContent>

					{characters.length > 0 && (
						<TabsContent value="characters" className="h-full m-0">
							<PlantUMLViewer
								code={characterCode}
								title="角色关系图"
								className="h-full"
							/>
						</TabsContent>
					)}
				</div>
			</Tabs>
		</div>
	);
}
