/**
 * 剧情点编辑器组件
 */

import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { PlotPoint } from "@/db/schema-outline";
import { cn } from "@/lib/utils";

interface PlotPointEditorProps {
	points: PlotPoint[];
	onChange: (points: PlotPoint[]) => void;
}

const PLOT_POINT_TYPES = [
	{ value: "setup", label: "开端", color: "text-blue-600" },
	{ value: "conflict", label: "冲突", color: "text-orange-600" },
	{ value: "climax", label: "高潮", color: "text-red-600" },
	{ value: "resolution", label: "结局", color: "text-green-600" },
] as const;

export function PlotPointEditor({ points, onChange }: PlotPointEditorProps) {
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleAdd = () => {
		const newPoint: PlotPoint = {
			id: crypto.randomUUID(),
			type: "setup",
			description: "",
			order: points.length,
		};
		onChange([...points, newPoint]);
		setEditingId(newPoint.id);
	};

	const handleUpdate = (id: string, updates: Partial<PlotPoint>) => {
		onChange(
			points.map((p) => (p.id === id ? { ...p, ...updates } : p))
		);
	};

	const handleDelete = (id: string) => {
		onChange(points.filter((p) => p.id !== id));
	};

	return (
		<div className="space-y-2">
			{points.map((point, index) => {
				const typeConfig = PLOT_POINT_TYPES.find((t) => t.value === point.type);
				
				return (
					<div
						key={point.id}
						className="flex items-center gap-2 p-2 rounded-md border bg-card"
					>
						<GripVertical className="size-4 text-muted-foreground cursor-grab" />
						
						<Select
							value={point.type}
							onValueChange={(value) =>
								handleUpdate(point.id, { type: value as PlotPoint["type"] })
							}
						>
							<SelectTrigger className="w-[100px] h-8">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PLOT_POINT_TYPES.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										<span className={type.color}>{type.label}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{editingId === point.id ? (
							<Input
								value={point.description}
								onChange={(e) =>
									handleUpdate(point.id, { description: e.target.value })
								}
								onBlur={() => setEditingId(null)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										setEditingId(null);
									}
								}}
								placeholder="描述剧情点..."
								className="h-8 flex-1"
								autoFocus
							/>
						) : (
							<div
								className="flex-1 text-sm cursor-pointer hover:text-foreground"
								onClick={() => setEditingId(point.id)}
							>
								{point.description || (
									<span className="text-muted-foreground">点击编辑...</span>
								)}
							</div>
						)}

						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8"
							onClick={() => handleDelete(point.id)}
						>
							<Trash2 className="size-4 text-destructive" />
						</Button>
					</div>
				);
			})}

			<Button
				size="sm"
				variant="outline"
				className="w-full"
				onClick={handleAdd}
			>
				<Plus className="size-4 mr-1" />
				添加剧情点
			</Button>
		</div>
	);
}
