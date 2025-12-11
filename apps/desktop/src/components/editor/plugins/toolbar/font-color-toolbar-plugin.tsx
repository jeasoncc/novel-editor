import {
	$getSelectionStyleValueForProperty,
	$patchStyleText,
} from "@lexical/selection";
import { $getSelection, $isRangeSelection, type BaseSelection } from "lexical";
import { BaselineIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import {
	ColorPicker,
	ColorPickerAlphaSlider,
	ColorPickerArea,
	ColorPickerContent,
	ColorPickerEyeDropper,
	ColorPickerFormatSelect,
	ColorPickerHueSlider,
	ColorPickerInput,
	ColorPickerTrigger,
} from "@/components/editor/editor-ui/color-picker";
import { Button } from "@/components/ui/button";

export function FontColorToolbarPlugin() {
	const { activeEditor } = useToolbarContext();

	const [fontColor, setFontColor] = useState("#000");

	const $updateToolbar = (selection: BaseSelection) => {
		if ($isRangeSelection(selection)) {
			setFontColor(
				$getSelectionStyleValueForProperty(selection, "color", "#000"),
			);
		}
	};

	useUpdateToolbarHandler($updateToolbar);

	const applyStyleText = useCallback(
		(styles: Record<string, string>) => {
			activeEditor.update(() => {
				const selection = $getSelection();
				if (selection !== null) {
					$patchStyleText(selection, styles);
				}
			});
		},
		[activeEditor],
	);

	const onFontColorSelect = useCallback(
		(value: string) => {
			setFontColor(value);
			applyStyleText({ color: value });
		},
		[applyStyleText],
	);

	return (
		<ColorPicker
			modal
			defaultFormat="hex"
			value={fontColor}
			onValueChange={onFontColorSelect}
			onOpenChange={(open) => {
				if (!open) {
					// Small delay to ensure color picker closes properly
					setTimeout(() => {
						activeEditor.focus();
					}, 100);
				}
			}}
		>
			<ColorPickerTrigger asChild>
				<Button variant="outline" size="sm" className="relative px-3">
					<BaselineIcon className="h-4 w-4" />
					<div 
						className="absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-sm border border-border"
						style={{ backgroundColor: fontColor || '#000000' }}
					/>
				</Button>
			</ColorPickerTrigger>
			<ColorPickerContent>
				<ColorPickerArea />
				<div className="flex items-center gap-2">
					<ColorPickerEyeDropper />
					<div className="flex flex-1 flex-col gap-2">
						<ColorPickerHueSlider />
						<ColorPickerAlphaSlider />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ColorPickerFormatSelect />
					<ColorPickerInput />
				</div>
			</ColorPickerContent>
		</ColorPicker>
	);
}
