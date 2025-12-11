/**
 * 全局导出对话框管理器
 * Global Export Dialog Manager
 */

import React, { useState, useEffect } from "react";
import { ExportDialogEnhanced } from "./export-dialog-enhanced";
import { useSelectionStore } from "@/stores/selection";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/curd";

// Global export dialog state
let globalExportDialogState = {
	isOpen: false,
	projectId: "",
	projectTitle: "",
};

const exportDialogListeners: Array<() => void> = [];

// Global functions to control the export dialog
export const exportDialogManager = {
	open: (projectId?: string, projectTitle?: string) => {
		globalExportDialogState = {
			isOpen: true,
			projectId: projectId || "",
			projectTitle: projectTitle || "",
		};
		exportDialogListeners.forEach(listener => listener());
	},
	
	close: () => {
		globalExportDialogState = {
			...globalExportDialogState,
			isOpen: false,
		};
		exportDialogListeners.forEach(listener => listener());
	},
	
	subscribe: (listener: () => void) => {
		exportDialogListeners.push(listener);
		return () => {
			const index = exportDialogListeners.indexOf(listener);
			if (index > -1) {
				exportDialogListeners.splice(index, 1);
			}
		};
	},
};

export function ExportDialogManager() {
	const [dialogState, setDialogState] = useState(globalExportDialogState);
	const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
	const projects = useLiveQuery(() => db.getAllProjects(), []) ?? [];

	// Subscribe to global state changes
	useEffect(() => {
		const unsubscribe = exportDialogManager.subscribe(() => {
			setDialogState({ ...globalExportDialogState });
		});
		return unsubscribe;
	}, []);

	// Auto-fill project info if not provided
	const effectiveProjectId = dialogState.projectId || selectedProjectId || "";
	const currentProject = projects.find(p => p.id === effectiveProjectId);
	const effectiveProjectTitle = dialogState.projectTitle || currentProject?.title || "未命名项目";

	const handleOpenChange = (open: boolean) => {
		if (open) {
			exportDialogManager.open(effectiveProjectId, effectiveProjectTitle);
		} else {
			exportDialogManager.close();
		}
	};

	// Don't render if no project is selected
	if (!effectiveProjectId) {
		return null;
	}

	return (
		<ExportDialogEnhanced
			open={dialogState.isOpen}
			onOpenChange={handleOpenChange}
			projectId={effectiveProjectId}
			projectTitle={effectiveProjectTitle}
		/>
	);
}