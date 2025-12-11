import { $isCodeHighlightNode } from "@lexical/code";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	type LexicalEditor,
	SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
	BoldIcon,
	UnderlineIcon,
} from "lucide-react";
import {
	type JSX,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

import { getDOMRangeRect } from "@/components/editor/utils/get-dom-range-rect";
import { getSelectedNode } from "@/components/editor/utils/get-selected-node";
import { setFloatingElemPosition } from "@/components/editor/utils/set-floating-elem-position";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function FloatingTextFormat({
	editor,
	anchorElem,
	isBold,
	isUnderline,
}: {
	editor: LexicalEditor;
	anchorElem: HTMLElement;
	isBold: boolean;
	isUnderline: boolean;
}): JSX.Element {
	const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

	function mouseMoveListener(e: MouseEvent) {
		if (
			popupCharStylesEditorRef?.current &&
			(e.buttons === 1 || e.buttons === 3)
		) {
			if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
				const x = e.clientX;
				const y = e.clientY;
				const elementUnderMouse = document.elementFromPoint(x, y);

				if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
					// Mouse is not over the target element => not a normal click, but probably a drag
					popupCharStylesEditorRef.current.style.pointerEvents = "none";
				}
			}
		}
	}
	function mouseUpListener(e: MouseEvent) {
		if (popupCharStylesEditorRef?.current) {
			if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
				popupCharStylesEditorRef.current.style.pointerEvents = "auto";
			}
		}
	}

	useEffect(() => {
		if (popupCharStylesEditorRef?.current) {
			document.addEventListener("mousemove", mouseMoveListener);
			document.addEventListener("mouseup", mouseUpListener);

			return () => {
				document.removeEventListener("mousemove", mouseMoveListener);
				document.removeEventListener("mouseup", mouseUpListener);
			};
		}
	}, [popupCharStylesEditorRef]);

	const $updateTextFormatFloatingToolbar = useCallback(() => {
		const selection = $getSelection();

		const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
		const nativeSelection = window.getSelection();

		if (popupCharStylesEditorElem === null) {
			return;
		}

		const rootElement = editor.getRootElement();
		if (
			selection !== null &&
			nativeSelection !== null &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

			setFloatingElemPosition(
				rangeRect,
				popupCharStylesEditorElem,
				anchorElem,
				false,
			);
		}
	}, [editor, anchorElem]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				$updateTextFormatFloatingToolbar();
			});
		};

		window.addEventListener("resize", update);
		if (scrollerElem) {
			scrollerElem.addEventListener("scroll", update);
		}

		return () => {
			window.removeEventListener("resize", update);
			if (scrollerElem) {
				scrollerElem.removeEventListener("scroll", update);
			}
		};
	}, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			$updateTextFormatFloatingToolbar();
		});
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateTextFormatFloatingToolbar();
				});
			}),

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					$updateTextFormatFloatingToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, $updateTextFormatFloatingToolbar]);

	return (
		<div
			ref={popupCharStylesEditorRef}
			className="bg-background absolute top-0 left-0 flex gap-1 rounded-md border p-1 opacity-0 shadow-md transition-opacity duration-300 will-change-transform"
		>
			{editor.isEditable() && (
				<ToggleGroup
					type="multiple"
					value={[
						isBold ? "bold" : "",
						isUnderline ? "underline" : "",
					].filter(Boolean)}
					onValueChange={(newValues) => {
						// Handle format changes properly
						const currentFormats = new Set([
							isBold ? "bold" : "",
							isUnderline ? "underline" : "",
						].filter(Boolean));
						const newFormatsSet = new Set(newValues);
						
						// Find formats that were toggled
						["bold", "underline"].forEach((format) => {
							const wasActive = currentFormats.has(format);
							const isActive = newFormatsSet.has(format);
							
							if (wasActive !== isActive) {
								editor.update(() => {
									editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
								});
							}
						});
					}}
					variant="outline"
					size="sm"
				>
					<ToggleGroupItem
						value="bold"
						aria-label="Toggle bold"
						data-state={isBold ? "on" : "off"}
						className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
					>
						<BoldIcon className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem
						value="underline"
						aria-label="Toggle underline"
						data-state={isUnderline ? "on" : "off"}
						className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
					>
						<UnderlineIcon className="h-4 w-4" />
					</ToggleGroupItem>
				</ToggleGroup>
			)}
		</div>
	);
}

function useFloatingTextFormatToolbar(
	editor: LexicalEditor,
	anchorElem: HTMLDivElement | null,
): JSX.Element | null {
	const [isText, setIsText] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);

	const updatePopup = useCallback(() => {
		editor.getEditorState().read(() => {
			// Should not to pop up the floating toolbar when using IME input
			if (editor.isComposing()) {
				return;
			}
			const selection = $getSelection();
			const nativeSelection = window.getSelection();
			const rootElement = editor.getRootElement();

			if (
				nativeSelection !== null &&
				(!$isRangeSelection(selection) ||
					rootElement === null ||
					!rootElement.contains(nativeSelection.anchorNode))
			) {
				setIsText(false);
				return;
			}

			if (!$isRangeSelection(selection)) {
				return;
			}

			const node = getSelectedNode(selection);

			// Update text format
			setIsBold(selection.hasFormat("bold"));
			setIsUnderline(selection.hasFormat("underline"));

			if (
				!$isCodeHighlightNode(selection.anchor.getNode()) &&
				selection.getTextContent() !== ""
			) {
				setIsText($isTextNode(node) || $isParagraphNode(node));
			} else {
				setIsText(false);
			}

			const rawTextContent = selection.getTextContent().replace(/\n/g, "");
			if (!selection.isCollapsed() && rawTextContent === "") {
				setIsText(false);
				return;
			}
		});
	}, [editor]);

	useEffect(() => {
		document.addEventListener("selectionchange", updatePopup);
		return () => {
			document.removeEventListener("selectionchange", updatePopup);
		};
	}, [updatePopup]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(() => {
				updatePopup();
			}),
			editor.registerRootListener(() => {
				if (editor.getRootElement() === null) {
					setIsText(false);
				}
			}),
		);
	}, [editor, updatePopup]);

	if (!isText || !anchorElem) {
		return null;
	}

	return createPortal(
		<FloatingTextFormat
			editor={editor}
			anchorElem={anchorElem}
			isBold={isBold}
			isUnderline={isUnderline}
		/>,
		anchorElem,
	);
}

export function FloatingTextFormatToolbarPlugin({
	anchorElem,
}: {
	anchorElem: HTMLDivElement | null;
}): JSX.Element | null {
	const [editor] = useLexicalComposerContext();

	return useFloatingTextFormatToolbar(editor, anchorElem);
}
