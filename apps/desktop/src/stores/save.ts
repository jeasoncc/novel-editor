/**
 * 保存状态管理
 */
import { create } from "zustand";

export type SaveStatus = "saved" | "saving" | "error" | "unsaved";

interface SaveState {
	// 当前文档的保存状态
	status: SaveStatus;
	lastSaveTime: Date | null;
	errorMessage: string | null;

	// 是否有未保存的更改
	hasUnsavedChanges: boolean;

	// 手动保存相关
	isManualSaving: boolean;

	// Actions
	setStatus: (status: SaveStatus) => void;
	setLastSaveTime: (time: Date) => void;
	setErrorMessage: (message: string | null) => void;
	setHasUnsavedChanges: (hasChanges: boolean) => void;
	setIsManualSaving: (isSaving: boolean) => void;

	// 复合操作
	markAsSaved: () => void;
	markAsError: (message: string) => void;
	markAsSaving: () => void;
	markAsUnsaved: () => void;
}

export const useSaveStore = create<SaveState>((set) => ({
	status: "saved",
	lastSaveTime: null,
	errorMessage: null,
	hasUnsavedChanges: false,
	isManualSaving: false,

	setStatus: (status) => set({ status }),
	setLastSaveTime: (lastSaveTime) => set({ lastSaveTime }),
	setErrorMessage: (errorMessage) => set({ errorMessage }),
	setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
	setIsManualSaving: (isManualSaving) => set({ isManualSaving }),

	markAsSaved: () =>
		set({
			status: "saved",
			lastSaveTime: new Date(),
			errorMessage: null,
			hasUnsavedChanges: false,
			isManualSaving: false,
		}),

	markAsError: (message) =>
		set({
			status: "error",
			errorMessage: message,
			isManualSaving: false,
		}),

	markAsSaving: () =>
		set({
			status: "saving",
			errorMessage: null,
		}),

	markAsUnsaved: () =>
		set({
			status: "unsaved",
			hasUnsavedChanges: true,
		}),
}));
