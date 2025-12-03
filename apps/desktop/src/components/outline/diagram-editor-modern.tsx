/**
 * 现代化图表编辑器
 * 参考 VS Code 和现代编辑器的设计理念
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MermaidViewer } from "./mermaid-viewer";
import { PlantUMLViewer } from "./plantuml-viewer";
import { isKrokiEnabled } from "@/lib/diagram-settings";
import { getPresetsByType } from "@/lib/diagram-presets";
import { 
	Code2, 
	Eye, 
	Save, 
	X,
	Sparkles,
	FileCode2,
	LayoutPanelLeft,
	Maximize2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DiagramEditorProps {
	initialCode?: string;
	initialType?: "mermaid" | "plantuml";
	onSave?: (code: string, type: "mermaid" | "plantuml") => void;
	onClose?: () => void;
}

export function DiagramEditorModern({
	initialCode = "",
	initialType = "mermaid",
	onSave,
	onClose,
}: DiagramEditorProps) {
	const [diagramType, setDiagramType] = useState<"mermaid" | "plantuml">(initialType);
	const [code, setCode] = useState(initialCode);
	const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
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
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				handleSave();
			}
			if (e.key === 'Escape' && onClose) {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [code, diagramType]);

	const lineCount = code.split('\n').length;

	return (
		<div className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4]">
			{/* 顶部标题栏 - VS Code 风格 */}
			<div className="flex items-center justify-between h-12 px-4 bg-[#323233] border-b border-[#2d2d30]">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Code2 className="h-4 w-4 text-[#3794ff]" />
						<span className="text-sm font-medium">图表编辑器</span>
					</div>
					<div className="h-4 w-px bg-[#2d2d30]" />
					<div className="flex items-center gap-1">
						<button
							onClick={() => handleTypeChange("mermaid")}
							className={cn(
								"px-3 py-1 text-xs rounded transition-colors",
								diagramType === "mermaid"
									? "bg-[#3794ff] text-white"
									: "text-[#cccccc] hover:bg-[#2a2d2e]"
							)}
						>
							<Sparkles className="h-3 w-3 inline mr-1" />
							Mermaid
						</button>
						<button
							onClick={() => handleTypeChange("plantuml")}
							disabled={!krokiEnabled}
							className={cn(
								"px-3 py-1 text-xs rounded transition-colors",
								diagramType === "plantuml"
									? "bg-[#3794ff] text-white"
									: "text-[#cccccc] hover:bg-[#2a2d2e]",
								!krokiEnabled && "opacity-50 cursor-not-allowed"
							)}
						>
							<FileCode2 className="h-3 w-3 inline mr-1" />
							PlantUML
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Select onValueChange={handlePresetSelect}>
						<SelectTrigger className="w-[160px] h-7 text-xs bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc]">
							<SelectValue placeholder="选择模板..." />
						</SelectTrigger>
						<SelectContent className="bg-[#252526] border-[#3c3c3c]">
							{presets.map((preset) => (
								<SelectItem 
									key={preset.id} 
									value={preset.id}
									className="text-[#cccccc] focus:bg-[#2a2d2e] focus:text-white"
								>
									{preset.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="h-4 w-px bg-[#2d2d30]" />

					<div className="flex items-center gap-1">
						<button
							onClick={() => setViewMode("code")}
							className={cn(
								"p-1.5 rounded transition-colors",
								viewMode === "code"
									? "bg-[#37373d] text-white"
									: "text-[#cccccc] hover:bg-[#2a2d2e]"
							)}
							title="代码"
						>
							<Code2 className="h-4 w-4" />
						</button>
						<button
							onClick={() => setViewMode("split")}
							className={cn(
								"p-1.5 rounded transition-colors",
								viewMode === "split"
									? "bg-[#37373d] text-white"
									: "text-[#cccccc] hover:bg-[#2a2d2e]"
							)}
							title="分屏"
						>
							<LayoutPanelLeft className="h-4 w-4" />
						</button>
						<button
							onClick={() => setViewMode("preview")}
							className={cn(
								"p-1.5 rounded transition-colors",
								viewMode === "preview"
									? "bg-[#37373d] text-white"
									: "text-[#cccccc] hover:bg-[#2a2d2e]"
							)}
							title="预览"
						>
							<Eye className="h-4 w-4" />
						</button>
					</div>

					<div className="h-4 w-px bg-[#2d2d30]" />

					<Button
						size="sm"
						onClick={handleSave}
						className="h-7 px-3 text-xs bg-[#0e639c] hover:bg-[#1177bb] text-white"
					>
						<Save className="h-3 w-3 mr-1.5" />
						保存
					</Button>

					{onClose && (
						<button
							onClick={onClose}
							className="p-1.5 rounded text-[#cccccc] hover:bg-[#2a2d2e] transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>

			{/* 主编辑区 */}
			<div className="flex-1 flex overflow-hidden">
				{/* 代码编辑器 */}
				{(viewMode === "code" || viewMode === "split") && (
					<div 
						className={cn(
							"flex flex-col bg-[#1e1e1e]",
							viewMode === "split" ? "w-1/2 border-r border-[#2d2d30]" : "w-full"
						)}
					>
						{/* 编辑器标签栏 */}
						<div className="flex items-center h-9 px-3 bg-[#252526] border-b border-[#2d2d30]">
							<div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-t text-xs">
								<Code2 className="h-3 w-3 text-[#3794ff]" />
								<span>diagram.{diagramType === "mermaid" ? "mmd" : "puml"}</span>
							</div>
						</div>

						{/* 代码区域 */}
						<div className="flex-1 relative">
							{/* 行号 */}
							<div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#2d2d30] pt-3 text-right pr-2 text-xs text-[#858585] select-none font-mono">
								{Array.from({ length: lineCount }, (_, i) => (
									<div key={i} className="leading-6">
										{i + 1}
									</div>
								))}
							</div>

							{/* 代码输入 */}
							<Textarea
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className="absolute inset-0 w-full h-full pl-14 pr-4 py-3 resize-none font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] border-0 focus-visible:ring-0 leading-6"
								placeholder={
									diagramType === "mermaid"
										? "// 输入 Mermaid 代码\ngraph TD\n    A[开始] --> B[结束]"
										: "// 输入 PlantUML 代码\n@startuml\nAlice -> Bob\n@enduml"
								}
								spellCheck={false}
								style={{
									caretColor: '#aeafad',
								}}
							/>
						</div>

						{/* 底部状态栏 */}
						<div className="flex items-center justify-between h-6 px-3 bg-[#007acc] text-white text-xs">
							<div className="flex items-center gap-3">
								<span>{diagramType === "mermaid" ? "Mermaid" : "PlantUML"}</span>
								<span>UTF-8</span>
							</div>
							<div className="flex items-center gap-3">
								<span>第 {lineCount} 行</span>
								<span>{code.length} 字符</span>
							</div>
						</div>
					</div>
				)}

				{/* 预览区域 */}
				{(viewMode === "preview" || viewMode === "split") && (
					<div 
						className={cn(
							"flex flex-col bg-white dark:bg-[#1e1e1e]",
							viewMode === "split" ? "w-1/2" : "w-full"
						)}
					>
						{/* 预览标签栏 */}
						<div className="flex items-center h-9 px-3 bg-[#252526] border-b border-[#2d2d30]">
							<div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-t text-xs text-[#cccccc]">
								<Eye className="h-3 w-3 text-[#3794ff]" />
								<span>预览</span>
							</div>
						</div>

						{/* 预览内容 */}
						<div className="flex-1 overflow-auto bg-white dark:bg-[#252526] p-6">
							{code.trim() ? (
								diagramType === "mermaid" ? (
									<MermaidViewer code={code} />
								) : (
									<PlantUMLViewer code={code} className="h-full" />
								)
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center text-[#858585]">
										<Maximize2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
										<p className="text-sm">在左侧输入代码</p>
										<p className="text-xs mt-2">预览将自动显示</p>
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
