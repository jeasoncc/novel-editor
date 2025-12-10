/**
 * 内联图表编辑器
 * 与应用整体风格一致，不使用弹窗
 */

import {
	ChevronDown,
	Code2,
	Columns,
	Eye,
	Maximize2,
	Save,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getPresetsByType } from "@/lib/diagram-presets";
import { isKrokiEnabled } from "@/lib/diagram-settings";
import { cn } from "@/lib/utils";
import { MermaidViewer } from "./mermaid-viewer";
import { PlantUMLViewer } from "./plantuml-viewer";

interface DiagramEditorInlineProps {
	initialCode?: string;
	initialType?: "mermaid" | "plantuml";
	onSave?: (code: string, type: "mermaid" | "plantuml") => void;
	onClose?: () => void;
}

export function DiagramEditorInline({
	initialCode = "",
	initialType = "mermaid",
	onSave,
	onClose,
}: DiagramEditorInlineProps) {
	const [diagramType, setDiagramType] = useState<"mermaid" | "plantuml">(
		initialType,
	);
	const [code, setCode] = useState(initialCode);
	const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
		"split",
	);
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
			toast.success(`已加载：${preset.name}`);
		}
	};

	const handleSave = () => {
		if (onSave) {
			onSave(code, diagramType);
		}
	};

	// 键盘快捷键
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				handleSave();
			}
			if (e.key === "Escape" && onClose) {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [code, diagramType]);

	const lineCount = code.split("\n").length;

	return (
		<div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card shadow-sm">
			{/* 工具栏 */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/50">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Code2 className="h-4 w-4 text-primary" />
						<span className="text-sm font-semibold">图表编辑器</span>
					</div>

					<Separator orientation="vertical" className="h-4" />

					{/* 类型选择 */}
					<div className="flex items-center gap-1 bg-background rounded-md p-0.5">
						<Button
							variant={diagramType === "mermaid" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 px-3 text-xs transition-all",
								diagramType === "mermaid" && "shadow-sm",
							)}
							onClick={() => handleTypeChange("mermaid")}
						>
							Mermaid
						</Button>
						<Button
							variant={diagramType === "plantuml" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 px-3 text-xs transition-all",
								diagramType === "plantuml" && "shadow-sm",
							)}
							onClick={() => handleTypeChange("plantuml")}
							disabled={!krokiEnabled}
						>
							PlantUML
						</Button>
					</div>

					<Separator orientation="vertical" className="h-4" />

					{/* 模板选择 */}
					<Select onValueChange={handlePresetSelect}>
						<SelectTrigger className="w-[160px] h-7 text-xs">
							<ChevronDown className="h-3 w-3 mr-1.5 opacity-50" />
							<SelectValue placeholder="选择模板..." />
						</SelectTrigger>
						<SelectContent>
							{presets.map((preset) => (
								<SelectItem
									key={preset.id}
									value={preset.id}
									className="text-xs"
								>
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">{preset.name}</span>
										<span className="text-[10px] text-muted-foreground">
											{preset.description}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					{/* 视图模式 */}
					<div className="flex items-center gap-0.5 bg-background rounded-md p-0.5">
						<Button
							variant={viewMode === "code" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 px-2.5 transition-all",
								viewMode === "code" && "shadow-sm",
							)}
							onClick={() => setViewMode("code")}
							title="代码模式"
						>
							<Code2 className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant={viewMode === "split" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 px-2.5 transition-all",
								viewMode === "split" && "shadow-sm",
							)}
							onClick={() => setViewMode("split")}
							title="分屏模式"
						>
							<Columns className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant={viewMode === "preview" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 px-2.5 transition-all",
								viewMode === "preview" && "shadow-sm",
							)}
							onClick={() => setViewMode("preview")}
							title="预览模式"
						>
							<Eye className="h-3.5 w-3.5" />
						</Button>
					</div>

					<Separator orientation="vertical" className="h-4" />

					<Button size="sm" onClick={handleSave} className="h-7 shadow-sm">
						<Save className="h-3.5 w-3.5 mr-1.5" />
						保存
					</Button>

					{onClose && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
							onClick={onClose}
							title="关闭编辑器 (Esc)"
						>
							<X className="h-3.5 w-3.5" />
						</Button>
					)}
				</div>
			</div>

			{/* 编辑区域 */}
			<div className="flex-1 flex overflow-hidden">
				{/* 代码编辑器 */}
				{(viewMode === "code" || viewMode === "split") && (
					<div
						className={cn(
							"flex flex-col transition-all duration-200",
							viewMode === "split" ? "w-1/2 border-r" : "w-full",
						)}
					>
						<div className="flex-1 p-4 relative">
							<Textarea
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className="w-full h-full resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
								placeholder={
									diagramType === "mermaid"
										? "// 输入 Mermaid 代码\n// 例如：\ngraph TD\n    A[开始] --> B[结束]"
										: "// 输入 PlantUML 代码\n// 例如：\n@startuml\nAlice -> Bob\n@enduml"
								}
								spellCheck={false}
							/>
							{code.length === 0 && (
								<div className="absolute top-20 left-1/2 -translate-x-1/2 text-center text-muted-foreground pointer-events-none">
									<Code2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
									<p className="text-xs">开始输入代码</p>
								</div>
							)}
						</div>
						<div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs">
							<div className="flex items-center gap-3 text-muted-foreground">
								<span className="font-medium">
									{diagramType === "mermaid" ? "Mermaid" : "PlantUML"}
								</span>
								<span>·</span>
								<span>UTF-8</span>
							</div>
							<div className="flex items-center gap-3 text-muted-foreground">
								<span>{lineCount} 行</span>
								<span>·</span>
								<span>{code.length} 字符</span>
							</div>
						</div>
					</div>
				)}

				{/* 预览区域 */}
				{(viewMode === "preview" || viewMode === "split") && (
					<div
						className={cn(
							"flex flex-col transition-all duration-200",
							viewMode === "split" ? "w-1/2" : "w-full",
						)}
					>
						<div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/20">
							<Eye className="h-3.5 w-3.5 text-muted-foreground" />
							<span className="text-xs font-medium text-muted-foreground">
								实时预览
							</span>
							{code.trim() && (
								<span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
									<span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
									已同步
								</span>
							)}
						</div>
						<div className="flex-1 overflow-auto p-6 bg-muted/5">
							{code.trim() ? (
								<div className="animate-in fade-in duration-200">
									{diagramType === "mermaid" ? (
										<MermaidViewer code={code} />
									) : (
										<PlantUMLViewer code={code} className="h-full" />
									)}
								</div>
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center text-muted-foreground">
										<Maximize2 className="h-16 w-16 mx-auto mb-4 opacity-10" />
										<p className="text-sm font-medium mb-1">等待输入</p>
										<p className="text-xs">在左侧输入代码，预览将自动显示</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
