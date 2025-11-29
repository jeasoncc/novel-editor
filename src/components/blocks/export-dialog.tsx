/**
 * 导出对话框组件
 */
import { useState } from "react";
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
import { FileText, FileType, File, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
	exportProject,
	type ExportFormat,
	type ExportOptions,
} from "@/services/export";

interface ExportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	projectTitle?: string;
}

export function ExportDialog({
	open,
	onOpenChange,
	projectId,
	projectTitle,
}: ExportDialogProps) {
	const [format, setFormat] = useState<ExportFormat>("pdf");
	const [isExporting, setIsExporting] = useState(false);
	const [options, setOptions] = useState<ExportOptions>({
		includeTitle: true,
		includeAuthor: true,
		includeChapterTitles: true,
		includeSceneTitles: false,
		pageBreakBetweenChapters: true,
	});

	const handleExport = async () => {
		setIsExporting(true);
		try {
			await exportProject(projectId, format, options);
			toast.success(`${formatLabels[format]} 导出成功`);
			onOpenChange(false);
		} catch (error) {
			console.error("Export error:", error);
			toast.error(
				error instanceof Error ? error.message : "导出失败，请重试"
			);
		} finally {
			setIsExporting(false);
		}
	};

	const formatLabels: Record<ExportFormat, string> = {
		pdf: "PDF",
		docx: "Word",
		txt: "纯文本",
	};

	const formatDescriptions: Record<ExportFormat, string> = {
		pdf: "适合打印和分享，保持精美排版",
		docx: "可在 Word 中编辑，支持格式调整",
		txt: "纯文本格式，兼容性最好",
	};

	const formatIcons: Record<ExportFormat, React.ReactNode> = {
		pdf: <FileText className="size-5 text-red-500" />,
		docx: <FileType className="size-5 text-blue-500" />,
		txt: <File className="size-5 text-gray-500" />,
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[480px]">
				<DialogHeader>
					<DialogTitle>导出作品</DialogTitle>
					<DialogDescription>
						将《{projectTitle || "作品"}》导出为文件
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* 格式选择 */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">导出格式</Label>
						<RadioGroup
							value={format}
							onValueChange={(v) => setFormat(v as ExportFormat)}
							className="grid grid-cols-3 gap-3"
						>
							{(["pdf", "docx", "txt"] as ExportFormat[]).map((f) => (
								<label
									key={f}
									className={`
										flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all
										${format === f
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
										}
									`}
								>
									<RadioGroupItem value={f} className="sr-only" />
									{formatIcons[f]}
									<span className="text-sm font-medium">{formatLabels[f]}</span>
									<span className="text-xs text-muted-foreground text-center">
										{formatDescriptions[f]}
									</span>
								</label>
							))}
						</RadioGroup>
					</div>

					{/* 导出选项 */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">导出选项</Label>
						<div className="space-y-3 rounded-lg border p-4">
							<div className="flex items-center space-x-3">
								<Checkbox
									id="includeTitle"
									checked={options.includeTitle}
									onCheckedChange={(checked) =>
										setOptions({ ...options, includeTitle: !!checked })
									}
								/>
								<Label htmlFor="includeTitle" className="text-sm cursor-pointer">
									包含书名
								</Label>
							</div>

							<div className="flex items-center space-x-3">
								<Checkbox
									id="includeAuthor"
									checked={options.includeAuthor}
									onCheckedChange={(checked) =>
										setOptions({ ...options, includeAuthor: !!checked })
									}
								/>
								<Label htmlFor="includeAuthor" className="text-sm cursor-pointer">
									包含作者名
								</Label>
							</div>

							<div className="flex items-center space-x-3">
								<Checkbox
									id="includeChapterTitles"
									checked={options.includeChapterTitles}
									onCheckedChange={(checked) =>
										setOptions({ ...options, includeChapterTitles: !!checked })
									}
								/>
								<Label
									htmlFor="includeChapterTitles"
									className="text-sm cursor-pointer"
								>
									包含章节标题
								</Label>
							</div>

							<div className="flex items-center space-x-3">
								<Checkbox
									id="includeSceneTitles"
									checked={options.includeSceneTitles}
									onCheckedChange={(checked) =>
										setOptions({ ...options, includeSceneTitles: !!checked })
									}
								/>
								<Label
									htmlFor="includeSceneTitles"
									className="text-sm cursor-pointer"
								>
									包含场景标题
								</Label>
							</div>

							{format !== "txt" && (
								<div className="flex items-center space-x-3">
									<Checkbox
										id="pageBreakBetweenChapters"
										checked={options.pageBreakBetweenChapters}
										onCheckedChange={(checked) =>
											setOptions({
												...options,
												pageBreakBetweenChapters: !!checked,
											})
										}
									/>
									<Label
										htmlFor="pageBreakBetweenChapters"
										className="text-sm cursor-pointer"
									>
										章节间分页
									</Label>
								</div>
							)}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isExporting}
					>
						取消
					</Button>
					<Button onClick={handleExport} disabled={isExporting}>
						{isExporting ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								导出中...
							</>
						) : (
							<>导出 {formatLabels[format]}</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
