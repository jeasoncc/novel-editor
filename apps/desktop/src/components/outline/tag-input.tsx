/**
 * 标签输入组件
 */

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
	tags: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

export function TagInput({
	tags,
	onChange,
	placeholder = "添加标签...",
}: TagInputProps) {
	const [input, setInput] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const handleAdd = () => {
		const trimmed = input.trim();
		if (trimmed && !tags.includes(trimmed)) {
			onChange([...tags, trimmed]);
			setInput("");
			setIsAdding(false);
		}
	};

	const handleRemove = (tag: string) => {
		onChange(tags.filter((t) => t !== tag));
	};

	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<Badge
					key={tag}
					variant="secondary"
					className="gap-1 cursor-pointer hover:bg-secondary/80"
					onClick={() => handleRemove(tag)}
				>
					{tag}
					<X className="size-3" />
				</Badge>
			))}

			{isAdding ? (
				<div className="flex items-center gap-1">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleAdd();
							} else if (e.key === "Escape") {
								setInput("");
								setIsAdding(false);
							}
						}}
						onBlur={() => {
							if (input.trim()) {
								handleAdd();
							} else {
								setIsAdding(false);
							}
						}}
						placeholder={placeholder}
						className="h-6 w-24 text-xs"
						autoFocus
					/>
				</div>
			) : (
				<Button
					size="sm"
					variant="outline"
					className="h-6 px-2 text-xs"
					onClick={() => setIsAdding(true)}
				>
					<Plus className="size-3 mr-1" />
					添加
				</Button>
			)}
		</div>
	);
}
