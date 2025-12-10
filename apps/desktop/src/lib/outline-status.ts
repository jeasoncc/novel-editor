/**
 * 大纲状态配置
 */

import { AlertCircle, CheckCircle, Edit, FileText, Pause } from "lucide-react";
import type { OutlineStatus } from "@/db/schema-outline";

export const STATUS_CONFIG = {
	draft: {
		label: "草稿",
		color: "gray",
		icon: FileText,
		className: "text-muted-foreground bg-muted",
	},
	"in-progress": {
		label: "进行中",
		color: "blue",
		icon: Edit,
		className: "text-blue-600 bg-blue-50 dark:bg-blue-950",
	},
	completed: {
		label: "已完成",
		color: "green",
		icon: CheckCircle,
		className: "text-green-600 bg-green-50 dark:bg-green-950",
	},
	"needs-revision": {
		label: "需修改",
		color: "yellow",
		icon: AlertCircle,
		className: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950",
	},
	"on-hold": {
		label: "暂停",
		color: "orange",
		icon: Pause,
		className: "text-orange-600 bg-orange-50 dark:bg-orange-950",
	},
} as const;

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
	([value, config]) => ({
		value: value as OutlineStatus,
		...config,
	}),
);
