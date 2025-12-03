/**
 * 改进的图表编辑器
 * 更美观、更专业的界面设计
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MermaidViewer } from "./mermaid-viewer";
import { PlantUMLViewer } from "./plantuml-viewer";
import { isKrokiEnabled } from "@/lib/diagram-settings";
import { getPresetsByType, type DiagramPreset } from "@/lib/diagram-presets";
import { 
	Code2, 
	Eye, 
	Save, 
	RotateCcw, 
	Columns, 
	FileCode,
	Sparkles,
	Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DiagramEditorProps {
	initialCode?: string;
	initialType?: "mermaid" | "plantuml";
	onSave?: (code: string, type: "mermaid" | "plantuml") => void;
}

type ViewMode = "split" | "code" | "preview";

export function DiagramEditorImproved({
	initialCode = "",
	initialType = "mermaid",
	onSave,
}: DiagramEditorProps) {
	const [diagramType, setDiagramType] = useState<"mermaid" | "plantuml">(initialType);
	const [code, setCode] = useState(initialCode);
	const [viewMode, setViewMode] = useState<ViewMode>("split");
	const krokiEnabled = isKrokiEnabled();

	const presets = getPresetsByType(diagramType);

	useEffect(() => {
		if (!initialCode) {
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

	const lineCount = code.split('\n').length;
	const charCount = code.length;

	// 键盘快捷键
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + S 保存
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				handleSave();
			}
			// Ctrl/Cmd + R 重置
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault();
				handleReset();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [code, diagramType]);

	return (
		<div className="flex flex-col h-full bg-background">
			{/* 顶部工具栏 */}
			<div className="border-b bg-muted/30">
				<div className="flex items-center justify-between px-6 py-3">
					{/* 左侧：类型和模板 */}
					<div className="flex items-center gap-4">
						{/* 图表类型 */}
						<div className="flex items-center gap-2">
							<Label className="text-sm font-medium">类型</Label>
							<div className="flex gap-1 bg-background rounded-lg p-1 border">
								<Button
									variant={diagramType === "mermaid" ? "default" : "ghost"}
									size="sm"
									className="h-7 px-3"
									onClick={() => handleTypeChange("mermaid")}
								>
									<Sparkles className="h-3.5 w-3.5 mr-1.5" />
									Mermaid
								</Button>
								<Button
									variant={diagramType === "plantuml" ? "default" : "ghost"}
									size="sm"
									className="h-7 px-3"
									onClick={() => handleTypeChange("plantuml")}
									disabled={!krokiEnabled}
								>
									<FileCode className="h-3.5 w-3.5 mr-1.5" />
									PlantUML
								</Button>
							</div>
						</div>

						<Separator orientation="vertical" className="h-6" />

						{/* 模板选择 */}
						<div className="flex items-center gap-2">
							<Label className="text-sm font-medium">模板</Label>
							<Select onValueChange={handlePresetSelect}>
								<SelectTrigger className="w-[180px] h-8">
									<SelectValue placeholder="选择模板" />
								</SelectTrigger>
								<SelectContent>
									{presets.map((preset) => (
										<SelectItem key={preset.id} value={preset.id}>
											<div className="flex flex-col">
												<span className="font-medium">{preset.name}</span>
												<span className="text-xs text-muted-foreground">
													{preset.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* 右侧：视图模式和操作 */}
					<div className="flex items-center gap-3">
						{/* 视图模式 */}
						<div className="flex gap-1 bg-background rounded-lg p-1 border">
							<Button
								variant={viewMode === "code" ? "default" : "ghost"}
								size="sm"
								className="h-7 px-3"
								onClick={() => setViewMode("code")}
							>
								<Code2 className="h-3.5 w-3.5 mr-1.5" />
								代码
							</Button>
							<Button
								variant={viewMode === "split" ? "default" : "ghost"}
								size="sm"
								className="h-7 px-3"
								onClick={() => setViewMode("split")}
							>
								<Columns className="h-3.5 w-3.5 mr-1.5" />
								分屏
							</Button>
							<Button
								variant={viewMode === "preview" ? "default" : "ghost"}
								size="sm"
								className="h-7 px-3"
								onClick={() => setViewMode("preview")}
							>
								<Eye className="h-3.5 w-3.5 mr-1.5" />
								预览
							</Button>
						</div>

						<Separator orientation="vertical" className="h-6" />

						{/* 操作按钮 */}
						<Button variant="outline" size="sm" onClick={handleReset}>
							<RotateCcw className="h-3.5 w-3.5 mr-1.5" />
							重置
						</Button>
						{onSave && (
							<Button size="sm" onClick={handleSave}>
								<Save className="h-3.5 w-3.5 mr-1.5" />
								保存
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* 编辑器主体 */}
			<div className="flex-1 flex overflow-hidden">
				{/* 代码编辑器 */}
				{(viewMode === "code" || viewMode === "split") && (
					<div 
						className={cn(
							"flex flex-col border-r bg-muted/10",
							viewMode === "split" ? "w-1/2" : "w-full"
						)}
					>
						{/* 编辑器头部 */}
						<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
							<div className="flex items-center gap-2">
								<Code2 className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">代码编辑器</span>
								<Badge variant="secondary" className="text-xs">
									{diagramType === "mermaid" ? "Mermaid" : "PlantUML"}
								</Badge>
							</div>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<span>{lineCount} 行</span>
								<span>·</span>
								<span>{charCount} 字符</span>
							</div>
						</div>

						{/* 代码输入区 */}
						<div className="flex-1 relative">
							<Textarea
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className="absolute inset-0 w-full h-full resize-none font-mono text-sm p-4 border-0 focus-visible:ring-0 bg-transparent"
								placeholder={
									diagramType === "mermaid"
										? "输入 Mermaid 代码...\n\n例如：\ngraph TD\n    A[开始] --> B[结束]"
										: "输入 PlantUML 代码...\n\n例如：\n@startuml\nAlice -> Bob: Hello\n@enduml"
								}
								spellCheck={false}
							/>
						</div>
					</div>
				)}

				{/* 预览区域 */}
				{(viewMode === "preview" || viewMode === "split") && (
					<div 
						className={cn(
							"flex flex-col bg-background",
							viewMode === "split" ? "w-1/2" : "w-full"
						)}
					>
						{/* 预览头部 */}
						<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">实时预览</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Info className="h-3.5 w-3.5" />
								<span>自动更新</span>
							</div>
						</div>

						{/* 预览内容 */}
						<div className="flex-1 overflow-auto p-6">
							{code.trim() ? (
								diagramType === "mermaid" ? (
									<MermaidViewer code={code} />
								) : (
									<PlantUMLViewer code={code} className="h-full" />
								)
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center text-muted-foreground">
										<Eye className="h-12 w-12 mx-auto mb-3 opacity-20" />
										<p className="text-sm">在左侧输入代码</p>
										<p className="text-xs mt-1">预览将自动显示</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* 底部提示栏 */}
			<div className="border-t bg-muted/30 px-6 py-2">
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-4">
						<span>💡 提示：使用 Ctrl/Cmd + S 快速保存</span>
					</div>
					<div className="flex items-center gap-2">
						<a
							href={diagramType === "mermaid" ? "https://mermaid.js.org/" : "https://plantuml.com/"}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							查看文档 →
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
