/**
 * 图表编辑器
 * 支持编辑 Mermaid 和 PlantUML 代码并实时预览
 */

import { Code, Eye, FileText, RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type DiagramPreset, getPresetsByType } from "@/lib/diagram-presets";
import { isKrokiEnabled } from "@/lib/diagram-settings";
import { MermaidViewer } from "./mermaid-viewer";
import { PlantUMLViewer } from "./plantuml-viewer";

interface DiagramEditorProps {
	initialCode?: string;
	initialType?: "mermaid" | "plantuml";
	onSave?: (code: string, type: "mermaid" | "plantuml") => void;
}

export function DiagramEditor({
	initialCode = "",
	initialType = "mermaid",
	onSave,
}: DiagramEditorProps) {
	const [diagramType, setDiagramType] = useState<"mermaid" | "plantuml">(
		initialType,
	);
	const [code, setCode] = useState(initialCode);
	const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
		"split",
	);
	const krokiEnabled = isKrokiEnabled();

	// 获取预设模板
	const presets = getPresetsByType(diagramType);

	useEffect(() => {
		if (!initialCode) {
			// 设置默认代码
			if (diagramType === "mermaid") {
				setCode(`graph TD
    A[开始] --> B[步骤1]
    B --> C[步骤2]
    C --> D[结束]`);
			} else {
				setCode(`@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi
@enduml`);
			}
		}
	}, [diagramType, initialCode]);

	const handleTypeChange = (type: "mermaid" | "plantuml") => {
		if (type === "plantuml" && !krokiEnabled) {
			toast.error("请先在设置中配置 Kroki 服务器");
			return;
		}
		setDiagramType(type);
	};

	const handlePresetSelect = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCode(preset.template);
			toast.success(`已加载模板：${preset.name}`);
		}
	};

	const handleSave = () => {
		if (onSave) {
			onSave(code, diagramType);
			toast.success("图表已保存");
		}
	};

	const handleReset = () => {
		setCode(initialCode || "");
		toast.success("已重置");
	};

	return (
		<div className="flex flex-col h-full">
			{/* 工具栏 */}
			<div className="flex items-center justify-between p-4 border-b gap-4">
				<div className="flex items-center gap-4">
					{/* 图表类型选择 */}
					<div className="flex items-center gap-2">
						<Label>类型</Label>
						<Tabs
							value={diagramType}
							onValueChange={(v) => handleTypeChange(v as any)}
						>
							<TabsList>
								<TabsTrigger value="mermaid">Mermaid</TabsTrigger>
								<TabsTrigger value="plantuml" disabled={!krokiEnabled}>
									PlantUML
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* 预设模板 */}
					<div className="flex items-center gap-2">
						<Label>模板</Label>
						<Select onValueChange={handlePresetSelect}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="选择模板" />
							</SelectTrigger>
							<SelectContent>
								{presets.map((preset) => (
									<SelectItem key={preset.id} value={preset.id}>
										{preset.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* 视图模式 */}
					<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
						<TabsList>
							<TabsTrigger value="code">
								<Code className="h-4 w-4" />
							</TabsTrigger>
							<TabsTrigger value="split">
								<FileText className="h-4 w-4" />
							</TabsTrigger>
							<TabsTrigger value="preview">
								<Eye className="h-4 w-4" />
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* 操作按钮 */}
					<Button variant="outline" size="sm" onClick={handleReset}>
						<RotateCcw className="h-4 w-4 mr-2" />
						重置
					</Button>
					{onSave && (
						<Button size="sm" onClick={handleSave}>
							<Save className="h-4 w-4 mr-2" />
							保存
						</Button>
					)}
				</div>
			</div>

			{/* 编辑器区域 */}
			<div className="flex-1 flex overflow-hidden">
				{/* 代码编辑器 */}
				{(viewMode === "code" || viewMode === "split") && (
					<div
						className={`${viewMode === "split" ? "w-1/2" : "w-full"} border-r`}
					>
						<Textarea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full h-full resize-none font-mono text-sm p-4 border-0 focus-visible:ring-0"
							placeholder={
								diagramType === "mermaid"
									? "输入 Mermaid 代码..."
									: "输入 PlantUML 代码..."
							}
						/>
					</div>
				)}

				{/* 预览区域 */}
				{(viewMode === "preview" || viewMode === "split") && (
					<div
						className={`${viewMode === "split" ? "w-1/2" : "w-full"} overflow-auto`}
					>
						{diagramType === "mermaid" ? (
							<div className="p-4">
								<MermaidViewer code={code} title="预览" />
							</div>
						) : (
							<PlantUMLViewer code={code} title="预览" className="h-full" />
						)}
					</div>
				)}
			</div>
		</div>
	);
}
