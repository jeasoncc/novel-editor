/**
 * 角色选择器组件
 */

import { X, Plus, User } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useRolesByProject } from "@/services/roles";

interface CharacterSelectorProps {
	projectId: string;
	selectedCharacters: string[];
	onChange: (characters: string[]) => void;
}

export function CharacterSelector({
	projectId,
	selectedCharacters,
	onChange,
}: CharacterSelectorProps) {
	const roles = useRolesByProject(projectId);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const selectedRoles = useMemo(
		() => roles.filter((r) => selectedCharacters.includes(r.id)),
		[roles, selectedCharacters]
	);

	const availableRoles = useMemo(() => {
		const filtered = roles.filter(
			(r) => !selectedCharacters.includes(r.id)
		);
		
		if (!search) return filtered;
		
		const query = search.toLowerCase();
		return filtered.filter(
			(r) =>
				r.name.toLowerCase().includes(query) ||
				r.alias?.some((a) => a.toLowerCase().includes(query))
		);
	}, [roles, selectedCharacters, search]);

	const handleAdd = (roleId: string) => {
		onChange([...selectedCharacters, roleId]);
		setSearch("");
	};

	const handleRemove = (roleId: string) => {
		onChange(selectedCharacters.filter((id) => id !== roleId));
	};

	return (
		<div className="flex flex-wrap gap-2">
			{selectedRoles.map((role) => (
				<Badge
					key={role.id}
					variant="secondary"
					className="gap-1.5 cursor-pointer hover:bg-secondary/80"
					onClick={() => handleRemove(role.id)}
				>
					<User className="size-3" />
					{role.name}
					<X className="size-3" />
				</Badge>
			))}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button size="sm" variant="outline" className="h-6 px-2 text-xs">
						<Plus className="size-3 mr-1" />
						添加角色
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-64 p-2" align="start">
					<Input
						placeholder="搜索角色..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-8 mb-2"
					/>
					<ScrollArea className="h-48">
						{availableRoles.length === 0 ? (
							<div className="text-sm text-muted-foreground text-center py-4">
								{search ? "未找到角色" : "暂无可选角色"}
							</div>
						) : (
							<div className="space-y-1">
								{availableRoles.map((role) => (
									<button
										key={role.id}
										onClick={() => {
											handleAdd(role.id);
											setOpen(false);
										}}
										className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-sm"
									>
										<User className="size-4 text-muted-foreground" />
										<span>{role.name}</span>
										{role.alias && role.alias.length > 0 && (
											<span className="text-xs text-muted-foreground">
												({role.alias[0]})
											</span>
										)}
									</button>
								))}
							</div>
						)}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</div>
	);
}
