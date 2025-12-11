/**
 * 增强导出功能的 Hook
 * Enhanced Export Functionality Hook
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
	universalExportService, 
	detectEnvironment,
	type ExportResult 
} from "@/services/export-enhanced";
import type { ExportFormat, ExportOptions } from "@/services/export";

interface UseEnhancedExportOptions {
	onSuccess?: (result: ExportResult) => void;
	onError?: (error: string) => void;
}

export function useEnhancedExport(options?: UseEnhancedExportOptions) {
	const [isExporting, setIsExporting] = useState(false);
	const [exportProgress, setExportProgress] = useState(0);
	const [lastResult, setLastResult] = useState<ExportResult | null>(null);

	const environment = detectEnvironment();
	const isTauriEnvironment = environment === "tauri";

	const exportProject = useCallback(async (
		projectId: string,
		format: ExportFormat,
		exportOptions?: ExportOptions,
		saveOptions?: {
			showDialog?: boolean;
			defaultPath?: string;
		}
	): Promise<ExportResult> => {
		setIsExporting(true);
		setExportProgress(0);
		setLastResult(null);

		try {
			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setExportProgress(prev => Math.min(prev + 10, 90));
			}, 200);

			const result = await universalExportService.exportProject(
				projectId,
				format,
				exportOptions,
				saveOptions
			);

			clearInterval(progressInterval);
			setExportProgress(100);
			setLastResult(result);

			if (result.success) {
				const message = isTauriEnvironment 
					? `文件已保存: ${result.filePath}`
					: `文件已下载: ${result.filePath}`;
				
				toast.success(message);
				options?.onSuccess?.(result);
			} else {
				const errorMessage = result.error || "导出失败";
				toast.error(errorMessage);
				options?.onError?.(errorMessage);
			}

			return result;
		} catch (error) {
			const errorMessage = `导出过程中发生错误: ${error}`;
			setLastResult({
				success: false,
				error: errorMessage,
			});
			toast.error(errorMessage);
			options?.onError?.(errorMessage);
			
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setIsExporting(false);
			// Reset progress after a delay
			setTimeout(() => {
				setExportProgress(0);
			}, 2000);
		}
	}, [isTauriEnvironment, options]);

	const quickExport = useCallback(async (
		projectId: string,
		format: ExportFormat = "txt",
		projectTitle?: string
	): Promise<ExportResult> => {
		const defaultOptions: ExportOptions = {
			includeTitle: true,
			includeAuthor: true,
			includeChapterTitles: true,
			includeSceneTitles: false,
			pageBreakBetweenChapters: true,
		};

		const saveOptions = {
			showDialog: isTauriEnvironment,
			defaultPath: projectTitle ? `${projectTitle}.${format}` : undefined,
		};

		return exportProject(projectId, format, defaultOptions, saveOptions);
	}, [exportProject, isTauriEnvironment]);

	const getEnvironmentInfo = useCallback(() => ({
		environment,
		isTauri: isTauriEnvironment,
		supportsFileDialog: isTauriEnvironment,
		supportsDirectSave: isTauriEnvironment,
	}), [environment, isTauriEnvironment]);

	return {
		// State
		isExporting,
		exportProgress,
		lastResult,
		
		// Actions
		exportProject,
		quickExport,
		
		// Environment info
		...getEnvironmentInfo(),
		
		// Service access
		exportService: universalExportService,
	};
}