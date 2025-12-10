/**
 * 状态选择器组件
 */

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { OutlineStatus } from "@/db/schema-outline";
import { STATUS_OPTIONS } from "@/lib/outline-status";

interface StatusSelectProps {
	value: OutlineStatus;
	onChange: (value: OutlineStatus) => void;
	className?: string;
}

export function StatusSelect({
	value,
	onChange,
	className,
}: StatusSelectProps) {
	const current = STATUS_OPTIONS.find((o) => o.value === value);

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className={className}>
				<SelectValue>
					{current && (
						<div className="flex items-center gap-2">
							<current.icon className="size-4" />
							<span>{current.label}</span>
						</div>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{STATUS_OPTIONS.map((option) => {
					const Icon = option.icon;
					return (
						<SelectItem key={option.value} value={option.value}>
							<div className="flex items-center gap-2">
								<Icon className="size-4" />
								<span>{option.label}</span>
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
