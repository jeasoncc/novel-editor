/**
 * 保存状态指示器 - 支持手动和自动保存状态显示
 */
import { AlertCircle, Check, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaveStore } from "@/stores/save";

interface SaveStatusIndicatorProps {
	className?: string;
	showLastSaveTime?: boolean;
}

export function SaveStatusIndicator({
	className,
	showLastSaveTime = false,
}: SaveStatusIndicatorProps) {
	const {
		status,
		lastSaveTime,
		errorMessage,
		hasUnsavedChanges,
		isManualSaving,
	} = useSaveStore();

	const getStatusDisplay = () => {
		if (isManualSaving) {
			return {
				icon: <Loader2 className="size-3.5 animate-spin" />,
				text: "手动保存中...",
				className: "text-primary",
			};
		}

		switch (status) {
			case "saved":
				return {
					icon: <Check className="size-3.5" />,
					text: hasUnsavedChanges ? "有未保存更改" : "已保存",
					className: hasUnsavedChanges
						? "text-orange-500"
						: "text-muted-foreground",
				};
			case "saving":
				return {
					icon: <Loader2 className="size-3.5 animate-spin" />,
					text: "自动保存中...",
					className: "text-primary",
				};
			case "error":
				return {
					icon: <AlertCircle className="size-3.5" />,
					text: "保存失败",
					className: "text-destructive",
				};
			case "unsaved":
				return {
					icon: <Save className="size-3.5" />,
					text: "有未保存更改",
					className: "text-orange-500",
				};
			default:
				return {
					icon: <Check className="size-3.5" />,
					text: "已保存",
					className: "text-muted-foreground",
				};
		}
	};

	const statusDisplay = getStatusDisplay();

	const formatLastSaveTime = (time: Date | null) => {
		if (!time) return "";
		const now = new Date();
		const diff = now.getTime() - time.getTime();

		if (diff < 60000) return "刚刚保存";
		if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前保存`;
		return time.toLocaleTimeString();
	};

	return (
		<div
			className={cn(
				"flex items-center gap-1.5 text-xs transition-all",
				statusDisplay.className,
				className,
			)}
			title={errorMessage || undefined}
		>
			{statusDisplay.icon}
			<span>{statusDisplay.text}</span>
			{showLastSaveTime && lastSaveTime && status === "saved" && (
				<span className="text-muted-foreground/60 ml-1">
					({formatLastSaveTime(lastSaveTime)})
				</span>
			)}
		</div>
	);
}
