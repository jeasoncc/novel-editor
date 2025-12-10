/**
 * 手动保存 Hook - 处理 Ctrl+S 快捷键和手动保存逻辑
 */

import type { SerializedEditorState } from "lexical";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";
import { keyboardShortcutManager } from "@/services/keyboard-shortcuts";
import { saveService } from "@/services/save";
import { useSaveStore } from "@/stores/save";

interface UseManualSaveOptions {
	sceneId: string | null;
	currentContent: SerializedEditorState | null;
	onSaveSuccess?: () => void;
	onSaveError?: (error: string) => void;
}

export function useManualSave({
	sceneId,
	currentContent,
	onSaveSuccess,
	onSaveError,
}: UseManualSaveOptions) {
	const { markAsSaved, markAsError, setIsManualSaving, hasUnsavedChanges } =
		useSaveStore();

	const { autoSave } = useSettings();
	const saveTimeoutRef = useRef<number | null>(null);

	// 执行手动保存
	const performManualSave = useCallback(async () => {
		if (!sceneId || !currentContent) {
			toast.info("没有可保存的内容");
			return;
		}

		// 如果没有未保存的更改，显示提示但不执行保存
		if (!hasUnsavedChanges && !saveService.hasUnsavedChanges(sceneId)) {
			toast.info("没有需要保存的更改");
			return;
		}

		setIsManualSaving(true);

		// 设置保存超时
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = window.setTimeout(() => {
			markAsError("保存超时");
			toast.error("保存超时，请检查网络连接");
		}, 10000);

		try {
			const result = await saveService.saveDocument(sceneId, currentContent);

			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
				saveTimeoutRef.current = null;
			}

			if (result.success) {
				markAsSaved();
				toast.success("保存成功");
				onSaveSuccess?.();
			} else {
				markAsError(result.error || "保存失败");
				toast.error(`保存失败: ${result.error || "未知错误"}`);
				onSaveError?.(result.error || "未知错误");
			}
		} catch (error) {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
				saveTimeoutRef.current = null;
			}

			const errorMessage = error instanceof Error ? error.message : "未知错误";
			markAsError(errorMessage);
			toast.error(`保存失败: ${errorMessage}`);
			onSaveError?.(errorMessage);
		} finally {
			setIsManualSaving(false);
		}
	}, [
		sceneId,
		currentContent,
		hasUnsavedChanges,
		setIsManualSaving,
		markAsSaved,
		markAsError,
		onSaveSuccess,
		onSaveError,
	]);

	// 注册 Ctrl+S 快捷键
	useEffect(() => {
		const shortcutKey = "ctrl+s";
		const metaShortcutKey = "meta+s"; // 支持 Mac 的 Cmd+S

		keyboardShortcutManager.registerShortcut(shortcutKey, performManualSave);
		keyboardShortcutManager.registerShortcut(
			metaShortcutKey,
			performManualSave,
		);

		return () => {
			keyboardShortcutManager.unregisterShortcut(shortcutKey);
			keyboardShortcutManager.unregisterShortcut(metaShortcutKey);
		};
	}, [performManualSave]);

	// 清理超时
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	return {
		performManualSave,
		canSave: Boolean(sceneId && currentContent),
	};
}
