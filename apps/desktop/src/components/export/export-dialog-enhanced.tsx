/**
 * 增强的导出对话框组件 - 支持 Tauri 和浏览器环境
 * Enhanced Export Dialog Component - Supports both Tauri and Browser environments
 */

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
	FileText, 
	FileType, 
	BookOpen, 
	Download, 
	Save, 
	AlertCircle, 
	CheckCircle,
	Loader2 
} from "lucide-react";
import { 
	universalExportService, 
	detectEnvironment,
	type ExportResult 
} from "@/services/export-enhanced";
import type { ExportFormat, ExportOptions } from "@/services/export";

interface ExportDialogEnhancedProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	projectTitle?: string;
}

interface ExportState {
	isExporting: boolean;
	progress: number;
	result: ExportResult | null;
	error: string | null;
}

const formatIcons = {
	txt: FileText,
	docx: FileType,
	pdf: FileText,
	epub: BookOpen,
};

const formatLabels = {
	txt: "纯文本 (.txt)",
	docx: "Word 文档 (.docx)",
	pdf: "PDF 文档 (.pdf)",
	epub: "电子书 (.epub)",
};

export function ExportDialogEnhanced({
	open,
	onOpenChange,
	projectId,
	projectTitle = "未命名项目",
}: ExportDialogEnhancedProps) {
	const [format, setFormat] = useState<ExportFormat>("txt");
	const [options, setOptions] = useState<ExportOptions>({
		includeTitle: true,
		includeAuthor: true,
		includeChapterTitles: true,
		includeSceneTitles: false,
		pageBreakBetweenChapters: true,
	});
	const [showSaveDialog, setShowSaveDialog] = useState(true);
	const [exportState, setExportState] = useState<ExportState>({
		isExporting: false,
		progress: 0,
		result: null,
		error: null,
	});

	const environment = detectEnvironment();
	const isTauri = environment === "tauri";

	// Reset state when dialog opens
	useEffect(() => {
		if (open) {
			setExportState({
				isExporting: false,
				progress: 0,
				result: null,
				error: null,
			});
		}
	}, [open]);

	const handleExport = async () => {
		setExportState({
			isExporting: true,
			progress: 10,
			result: null,
			error: null,
		});

		try {
			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setExportState(prev => ({
					...prev,
					progress: Math.min(prev.progress + 10, 90),
				}));
			}, 200);

			const result = await universalExportService.exportProject(
				projectId,
				format,
				options,
				{
					showDialog: isTauri ? showSaveDialog : false,
					defaultPath: `${projectTitle}.${format}`,
				}
			);

			clearInterval(progressInterval);

			setExportState({
				isExporting: false,
				progress: 100,
				result,
				error: result.success ? null : result.error || "导出失败",
			});

			// Auto-close dialog on success after a delay
			if (result.success) {
				setTimeout(() => {
					onOpenChange(false);
				}, 2000);
			}
		} catch (error) {
			setExportState({
				isExporting: false,
				progress: 0,
				result: null,
				error: `导出过程中发生错误: ${error}`,
			});
		}
	};

	const handleOptionChange = (key: keyof ExportOptions, value: boolean) => {
		setOptions(prev => ({
			...prev,
			[key]: value,
		}));
	};

	const renderFormatSelection = () => (
		<div className="space-y-4">
			<Label className="text-sm font-medium">导出格式</Label>
			<RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
				{(Object.keys(formatLabels) as ExportFormat[]).map((fmt) => {
					const Icon = formatIcons[fmt];
					return (
						<div key={fmt} className="flex items-center space-x-2">
							<RadioGroupItem value={fmt} id={fmt} />
							<Label htmlFor={fmt} className="flex items-center space-x-2 cursor-pointer">
								<Icon className="h-4 w-4" />
								<span>{formatLabels[fmt]}</span>
							</Label>
						</div>
					);
				})}
			</RadioGroup>
		</div>
	);

	const renderExportOptions = () => (
		<div className="space-y-4">
			<Label className="text-sm font-medium">导出选项</Label>
			<div className="space-y-3">
				{[
					{ key: "includeTitle" as const, label: "包含作品标题" },
					{ key: "includeAuthor" as const, label: "包含作者信息" },
					{ key: "includeChapterTitles" as const, label: "包含章节标题" },
					{ key: "includeSceneTitles" as const, label: "包含场景标题" },
					{ key: "pageBreakBetweenChapters" as const, label: "章节间分页" },
				].map(({ key, label }) => (
					<div key={key} className="flex items-center space-x-2">
						<Checkbox
							id={key}
							checked={options[key]}
							onCheckedChange={(checked) => handleOptionChange(key, !!checked)}
						/>
						<Label htmlFor={key} className="text-sm cursor-pointer">
							{label}
						</Label>
					</div>
				))}
			</div>
		</div>
	);

	const renderTauriOptions = () => {
		if (!isTauri) return null;

		return (
			<div className="space-y-4">
				<Label className="text-sm font-medium">保存选项</Label>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="showSaveDialog"
						checked={showSaveDialog}
						onCheckedChange={(checked) => setShowSaveDialog(!!checked)}
					/>
					<Label htmlFor="showSaveDialog" className="text-sm cursor-pointer">
						显示文件保存对话框
					</Label>
				</div>
			</div>
		);
	};

	const renderExportProgress = () => {
		if (!exportState.isExporting && !exportState.result && !exportState.error) {
			return null;
		}

		return (
			<div className="space-y-4">
				{exportState.isExporting && (
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm">正在导出...</span>
						</div>
						<Progress value={exportState.progress} className="w-full" />
					</div>
				)}

				{exportState.result?.success && (
					<Alert>
						<CheckCircle className="h-4 w-4" />
						<AlertDescription>
							导出成功！
							{exportState.result.filePath && (
								<span className="block text-xs text-muted-foreground mt-1">
									文件路径: {exportState.result.filePath}
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}

				{exportState.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{exportState.error}</AlertDescription>
					</Alert>
				)}
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Download className="h-5 w-5" />
						<span>导出项目</span>
						<Badge variant="outline" className="ml-auto">
							{isTauri ? "桌面版" : "浏览器版"}
						</Badge>
					</DialogTitle>
					<DialogDescription>
						选择导出格式和选项，将您的作品导出为文件。
						{isTauri && " 桌面版支持直接保存到本地文件系统。"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{renderFormatSelection()}
					{renderExportOptions()}
					{renderTauriOptions()}
					{renderExportProgress()}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={exportState.isExporting}
					>
						取消
					</Button>
					<Button
						onClick={handleExport}
						disabled={exportState.isExporting}
						className="flex items-center space-x-2"
					>
						{exportState.isExporting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : isTauri ? (
							<Save className="h-4 w-4" />
						) : (
							<Download className="h-4 w-4" />
						)}
						<span>
							{exportState.isExporting 
								? "导出中..." 
								: isTauri 
									? "保存文件" 
									: "下载文件"
							}
						</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}