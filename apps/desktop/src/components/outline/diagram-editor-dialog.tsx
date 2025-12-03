/**
 * 图表编辑器对话框
 */

import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import { DiagramEditorModern } from "./diagram-editor-modern";

interface DiagramEditorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialCode?: string;
	initialType?: "mermaid" | "plantuml";
	onSave?: (code: string, type: "mermaid" | "plantuml") => void;
}

export function DiagramEditorDialog({
	open,
	onOpenChange,
	initialCode,
	initialType,
	onSave,
}: DiagramEditorDialogProps) {
	const handleSave = (code: string, type: "mermaid" | "plantuml") => {
		if (onSave) {
			onSave(code, type);
		}
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[90vw] h-[90vh] p-0 gap-0 bg-[#1e1e1e] border-[#2d2d30]">
				<DiagramEditorModern
					initialCode={initialCode}
					initialType={initialType}
					onSave={handleSave}
					onClose={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
