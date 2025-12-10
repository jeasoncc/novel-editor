/**
 * 大纲详情编辑面板
 */

import type { SerializedEditorState } from "lexical";
import { Calendar, FileText, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MinimalEditor } from "@/components/blocks/rich-editor/minimal-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ChapterInterface, SceneInterface } from "@/db/schema";
import type { OutlineMetadata, OutlineStatus } from "@/db/schema-outline";
import { updateChapter } from "@/services/chapters";
import { updateScene } from "@/services/scenes";
import { CharacterSelector } from "./character-selector";
import { PlotPointEditor } from "./plot-point-editor";
import { StatusSelect } from "./status-select";
import { TagInput } from "./tag-input";

interface OutlineDetailPanelProps {
	node: (ChapterInterface | SceneInterface) & { type: "chapter" | "scene" };
	onClose: () => void;
	onUpdate: () => void;
}

export function OutlineDetailPanel({
	node,
	onClose,
	onUpdate,
}: OutlineDetailPanelProps) {
	const [title, setTitle] = useState(node.title);
	const [metadata, setMetadata] = useState<OutlineMetadata>(node.outline || {});
	const [hasChanges, setHasChanges] = useState(false);

	// 解析摘要
	const summaryState = useMemo(() => {
		if (!metadata.summary) return undefined;
		try {
			return JSON.parse(metadata.summary) as SerializedEditorState;
		} catch {
			return undefined;
		}
	}, [metadata.summary]);

	useEffect(() => {
		setTitle(node.title);
		setMetadata(node.outline || {});
		setHasChanges(false);
	}, [node]);

	const handleSave = async () => {
		try {
			const updates = {
				title,
				outline: {
					...metadata,
					updatedAt: new Date().toISOString(),
				},
			};

			if (node.type === "chapter") {
				await updateChapter(node.id, updates);
			} else {
				await updateScene(node.id, updates);
			}

			setHasChanges(false);
			onUpdate();
			toast.success("已保存");
		} catch {
			toast.error("保存失败");
		}
	};

	const updateMetadata = (updates: Partial<OutlineMetadata>) => {
		setMetadata((prev) => ({ ...prev, ...updates }));
		setHasChanges(true);
	};

	// 计算进度
	const progress = useMemo(() => {
		if (metadata.targetWordCount && metadata.wordCount) {
			return Math.min(
				100,
				Math.round((metadata.wordCount / metadata.targetWordCount) * 100),
			);
		}
		return metadata.progress || 0;
	}, [metadata.wordCount, metadata.targetWordCount, metadata.progress]);

	return (
		<div className="h-full flex flex-col bg-background">
			{/* 标题栏 */}
			<div className="flex items-center justify-between px-6 py-3 border-b border-border/30 bg-muted/5">
				<div className="flex items-center gap-2">
					<FileText className="size-5 text-muted-foreground" />
					<h3 className="font-semibold">
						{node.type === "chapter" ? "章节详情" : "场景详情"}
					</h3>
				</div>
				<div className="flex items-center gap-2">
					{hasChanges && (
						<Button size="sm" onClick={handleSave}>
							<Save className="size-4 mr-1" />
							保存
						</Button>
					)}
					<Button size="icon" variant="ghost" onClick={onClose}>
						<X className="size-4" />
					</Button>
				</div>
			</div>

			<ScrollArea className="flex-1">
				<div className="p-6 space-y-6">
					{/* 标题 */}
					<div className="space-y-2">
						<Label>标题</Label>
						<Input
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								setHasChanges(true);
							}}
							placeholder="输入标题..."
						/>
					</div>

					{/* 状态和标签 */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>状态</Label>
							<StatusSelect
								value={metadata.status || "draft"}
								onChange={(status: OutlineStatus) => updateMetadata({ status })}
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<Label>进度</Label>
							<div className="flex items-center gap-2">
								<Progress value={progress} className="flex-1" />
								<span className="text-sm text-muted-foreground w-12">
									{progress}%
								</span>
							</div>
						</div>
					</div>

					<Separator />

					{/* 摘要 */}
					<div className="space-y-2">
						<Label>摘要</Label>
						<div className="border border-border/30 rounded-lg overflow-hidden">
							<MinimalEditor
								key={node.id}
								editorSerializedState={summaryState}
								onSerializedChange={(state) => {
									updateMetadata({ summary: JSON.stringify(state) });
								}}
								placeholder="描述这个章节/场景的主要内容..."
							/>
						</div>
					</div>

					<Separator />

					{/* 剧情点 */}
					<div className="space-y-2">
						<Label>关键剧情点</Label>
						<PlotPointEditor
							points={metadata.plotPoints || []}
							onChange={(plotPoints) => updateMetadata({ plotPoints })}
						/>
					</div>

					<Separator />

					{/* 角色 */}
					<div className="space-y-2">
						<Label>涉及角色</Label>
						<CharacterSelector
							projectId={node.project}
							selectedCharacters={metadata.characters || []}
							onChange={(characters) => updateMetadata({ characters })}
						/>
					</div>

					<Separator />

					{/* 标签 */}
					<div className="space-y-2">
						<Label>标签</Label>
						<TagInput
							tags={metadata.tags || []}
							onChange={(tags) => updateMetadata({ tags })}
						/>
					</div>

					<Separator />

					{/* 字数目标 */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>当前字数</Label>
							<Input
								type="number"
								value={metadata.wordCount || 0}
								onChange={(e) =>
									updateMetadata({ wordCount: parseInt(e.target.value) || 0 })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>目标字数</Label>
							<Input
								type="number"
								value={metadata.targetWordCount || 0}
								onChange={(e) =>
									updateMetadata({
										targetWordCount: parseInt(e.target.value) || 0,
									})
								}
								placeholder="设置目标..."
							/>
						</div>
					</div>

					{/* 故事时间 */}
					<div className="space-y-2">
						<Label>故事时间</Label>
						<Input
							value={metadata.storyTime || ""}
							onChange={(e) => updateMetadata({ storyTime: e.target.value })}
							placeholder="例如：第三天上午"
						/>
					</div>

					<Separator />

					{/* 创作笔记 */}
					<div className="space-y-2">
						<Label>创作笔记</Label>
						<Textarea
							value={metadata.notes || ""}
							onChange={(e) => updateMetadata({ notes: e.target.value })}
							placeholder="记录创作想法、待办事项等..."
							rows={6}
						/>
					</div>
				</div>
			</ScrollArea>

			{/* 底部信息 */}
			<div className="px-6 py-3 border-t border-border/30 bg-muted/5 text-xs text-muted-foreground space-y-1">
				{metadata.createdAt && (
					<div className="flex items-center gap-2">
						<Calendar className="size-3" />
						<span>
							创建于 {new Date(metadata.createdAt).toLocaleString("zh-CN")}
						</span>
					</div>
				)}
				{metadata.updatedAt && (
					<div className="flex items-center gap-2">
						<Calendar className="size-3" />
						<span>
							更新于 {new Date(metadata.updatedAt).toLocaleString("zh-CN")}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
