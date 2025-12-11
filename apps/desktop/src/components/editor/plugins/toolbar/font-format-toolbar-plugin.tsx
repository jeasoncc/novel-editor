import { $isTableSelection } from "@lexical/table";
import {
	$isRangeSelection,
	type BaseSelection,
	FORMAT_TEXT_COMMAND,
	type TextFormatType,
} from "lexical";
import {
	BoldIcon,
	UnderlineIcon,
} from "lucide-react";
import { useCallback, useState } from "react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FORMATS = [
	{ format: "bold", icon: BoldIcon, label: "Bold" },
	{ format: "underline", icon: UnderlineIcon, label: "Underline" },
] as const;

export function FontFormatToolbarPlugin() {
	const { activeEditor } = useToolbarContext();
	const [activeFormats, setActiveFormats] = useState<string[]>([]);

	const $updateToolbar = useCallback((selection: BaseSelection) => {
		if ($isRangeSelection(selection) || $isTableSelection(selection)) {
			const formats: string[] = [];
			FORMATS.forEach(({ format }) => {
				if (selection.hasFormat(format as TextFormatType)) {
					formats.push(format);
				}
			});
			setActiveFormats((prev) => {
				// Only update if formats have changed
				if (
					prev.length !== formats.length ||
					!formats.every((f) => prev.includes(f))
				) {
					return formats;
				}
				return prev;
			});
		}
	}, []);

	useUpdateToolbarHandler($updateToolbar);

	return (
		<ToggleGroup
			type="multiple"
			value={activeFormats}
			onValueChange={(newFormats) => {
				// Handle format changes properly
				const currentFormats = new Set(activeFormats);
				const newFormatsSet = new Set(newFormats);
				
				// Find formats that were toggled
				FORMATS.forEach(({ format }) => {
					const wasActive = currentFormats.has(format);
					const isActive = newFormatsSet.has(format);
					
					if (wasActive !== isActive) {
						activeEditor.dispatchCommand(
							FORMAT_TEXT_COMMAND,
							format as TextFormatType,
						);
					}
				});
				
				setActiveFormats(newFormats);
			}}
			variant="outline"
			size="sm"
		>
			{FORMATS.map(({ format, icon: Icon, label }) => (
				<ToggleGroupItem
					key={format}
					value={format}
					aria-label={label}
					data-state={activeFormats.includes(format) ? "on" : "off"}
					className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				>
					<Icon className="h-4 w-4" />
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
