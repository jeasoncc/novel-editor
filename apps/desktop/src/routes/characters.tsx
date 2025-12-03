import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, User, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import type { SerializedEditorState } from "lexical";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MinimalEditor } from "@/components/blocks/rich-editor/minimal-editor";
import { useAllProjects } from "@/services/projects";
import {
	createRole,
	deleteRole,
	updateRole,
	useRolesByProject,
} from "@/services/roles";
import { type SelectionState, useSelectionStore } from "@/stores/selection";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/characters")({
	component: CharactersPage,
});

function CharactersPage() {
	const projects = useAllProjects();
	const confirm = useConfirm();
	const selectedProjectId = useSelectionStore(
		(s: SelectionState) => s.selectedProjectId,
	);
	const setSelectedProjectId = useSelectionStore(
		(s: SelectionState) => s.setSelectedProjectId,
	);

	const activeProjectId = useMemo(() => {
		if (selectedProjectId && projects.some((p) => p.id === selectedProjectId)) {
			return selectedProjectId;
		}
		return projects[0]?.id ?? null;
	}, [projects, selectedProjectId]);

	const roles = useRolesByProject(activeProjectId ?? null);

	const [newName, setNewName] = useState("");
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const [aliasInput, setAliasInput] = useState("");
	const [editorKey, setEditorKey] = useState(0);

	const selectedRole = useMemo(
		() => roles.find((r) => r.id === selectedRoleId) ?? null,
		[roles, selectedRoleId],
	);

	// 自动选择第一个角色
	useEffect(() => {
		if (roles.length > 0 && !selectedRoleId) {
			setSelectedRoleId(roles[0].id);
		} else if (roles.length === 0) {
			setSelectedRoleId(null);
		} else if (selectedRoleId && !roles.find((r) => r.id === selectedRoleId)) {
			setSelectedRoleId(roles[0].id);
		}
	}, [roles, selectedRoleId]);

	// 切换角色时强制刷新编辑器
	useEffect(() => {
		setEditorKey((k) => k + 1);
		setAliasInput("");
	}, [selectedRoleId]);

	// 获取当前角色的 experience 状态
	const experienceState = useMemo(() => {
		if (!selectedRole?.experience) return undefined;
		try {
			return JSON.parse(selectedRole.experience) as SerializedEditorState;
		} catch {
			return undefined;
		}
	}, [selectedRole?.experience]);

	async function handleCreate() {
		if (!activeProjectId) {
			toast.error("请先选择一本书");
			return;
		}
		const name = newName.trim() || "新角色";
		try {
			const newRole = await createRole({ projectId: activeProjectId, name });
			setNewName("");
			setSelectedRoleId(newRole.id);
		} catch {
			toast.error("创建失败");
		}
	}

	async function handleAddAlias() {
		if (!selectedRoleId || !aliasInput.trim() || !selectedRole) return;
		const newAlias = aliasInput.trim();
		const currentAlias = selectedRole.alias || [];
		if (currentAlias.includes(newAlias)) {
			toast.error("别名已存在");
			return;
		}
		try {
			await updateRole(selectedRoleId, { alias: [...currentAlias, newAlias] });
			setAliasInput("");
		} catch {
			toast.error("添加失败");
		}
	}

	async function handleRemoveAlias(alias: string) {
		if (!selectedRoleId || !selectedRole) return;
		const updatedAlias = (selectedRole.alias || []).filter((a) => a !== alias);
		try {
			await updateRole(selectedRoleId, { alias: updatedAlias });
		} catch {
			toast.error("删除失败");
		}
	}

	async function handleSaveExperience(state: SerializedEditorState) {
		if (!selectedRoleId) return;
		try {
			await updateRole(selectedRoleId, { experience: JSON.stringify(state) });
		} catch {
			// 静默失败，避免打扰用户
		}
	}

	async function handleDelete() {
		if (!selectedRole) return;
		const ok = await confirm({
			title: "删除角色",
			description: `确认删除 "${selectedRole.name}"？`,
			confirmText: "删除",
			cancelText: "取消",
		});
		if (!ok) return;
		try {
			await deleteRole(selectedRole.id);
		} catch {
			toast.error("删除失败");
		}
	}

	return (
		<div className="flex h-svh">
			{/* 左侧：角色列表 */}
			<div className="w-64 border-r flex flex-col bg-muted/30">
				<div className="p-3 border-b flex gap-2">
					<Input
						placeholder="角色名"
						value={newName}
						className="h-8"
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleCreate()}
					/>
					<Button size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCreate()}>
						<Plus className="size-4" />
					</Button>
				</div>

				<ScrollArea className="flex-1">
					{roles.length === 0 ? (
						<div className="p-4 text-sm text-muted-foreground text-center">
							暂无角色
						</div>
					) : (
						<div className="p-2">
							{roles.map((role) => (
								<button
									key={role.id}
									onClick={() => setSelectedRoleId(role.id)}
									className={cn(
										"w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
										"hover:bg-accent",
										selectedRoleId === role.id && "bg-accent font-medium"
									)}
								>
									<div className="flex items-center gap-2">
										<User className="size-3.5 text-muted-foreground shrink-0" />
										<span className="truncate">{role.name}</span>
									</div>
								</button>
							))}
						</div>
					)}
				</ScrollArea>

				{projects.length > 1 && (
					<div className="p-2 border-t">
						<select
							className="w-full h-8 rounded-md border bg-background px-2 text-xs"
							value={activeProjectId ?? ""}
							onChange={(e) => setSelectedProjectId(e.target.value || null)}
						>
							{projects.map((p) => (
								<option key={p.id} value={p.id}>{p.title}</option>
							))}
						</select>
					</div>
				)}
			</div>

			{/* 右侧：角色详情 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{selectedRole ? (
					<>
						{/* 顶部信息栏 */}
						<div className="border-b px-4 py-3 flex items-center gap-3">
							<h2 className="text-lg font-semibold flex-1">{selectedRole.name}</h2>
							<Button
								size="sm"
								variant="ghost"
								className="text-destructive hover:text-destructive"
								onClick={() => handleDelete()}
							>
								<Trash2 className="size-4" />
							</Button>
						</div>

						{/* 别名区域 */}
						<div className="px-4 py-2 border-b flex items-center gap-2 flex-wrap">
							<span className="text-xs text-muted-foreground">别名:</span>
							{(selectedRole.alias || []).map((alias) => (
								<Badge
									key={alias}
									variant="secondary"
									className="cursor-pointer text-xs h-6"
									onClick={() => handleRemoveAlias(alias)}
								>
									{alias}
									<X className="ml-1 size-3" />
								</Badge>
							))}
							<Input
								placeholder="+ 添加"
								value={aliasInput}
								className="h-6 w-24 text-xs"
								onChange={(e) => setAliasInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleAddAlias()}
							/>
						</div>

						{/* 编辑器区域 */}
						<div className="flex-1 overflow-hidden">
							<MinimalEditor
								key={editorKey}
								editorSerializedState={experienceState}
								onSerializedChange={handleSaveExperience}
								placeholder="描述角色的生平、性格、背景故事..."
							/>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-muted-foreground">
						<div className="text-center">
							<User className="size-10 mx-auto mb-2 opacity-30" />
							<p className="text-sm">选择或创建角色</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
