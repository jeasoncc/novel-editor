/**
 * 状态徽章组件
 */

import { Badge } from "@/components/ui/badge";
import type { OutlineStatus } from "@/db/schema-outline";
import { STATUS_CONFIG } from "@/lib/outline-status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
	status: OutlineStatus;
	className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = STATUS_CONFIG[status];
	const Icon = config.icon;

	return (
		<Badge
			variant="secondary"
			className={cn("gap-1.5 text-xs", config.className, className)}
		>
			<Icon className="size-3" />
			{config.label}
		</Badge>
	);
}
