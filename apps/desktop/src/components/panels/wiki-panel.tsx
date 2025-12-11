/**
 * Wiki面板 - 统一侧边栏中的世界观/Wiki管理功能
 * 支持角色、地点、物品等各种类型的知识管理
 */

import { BookOpen, Plus, Search, Tag, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	createWikiEntry,
	deleteWikiEntry,
	useWikiEntriesByProject,
} from "@/services/wiki";
import type { WikiEntryInterface } from "@/db/schema";
import { useSelectionStore } from "@/stores/selection";

interface WikiPanelProps {
	onSelectEntry?: (entry: WikiEntryInterface) => void;
	selectedEntryId?: string | null;
}

export function WikiPanel({
	onSelectEntry,
	selectedEntryId,
}: WikiPanelProps) {
	const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const entries = useWikiEntriesByProject(selectedProjectId);

	// Extract all unique tags from entries
	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		for (const entry of entries) {
			for (const tag of entry.tags) {
				tagSet.add(tag);
			}
		}
		return Array.from(tagSet).sort();
	}, [entries]);

	// Filter entries based on search query and selected tag
	const filteredEntries = useMemo(() => {
		return entries.filter((entry) => {
			// Filter by search query (name, alias, content)
			const matchesSearch =
				searchQuery === "" ||
				entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				entry.alias.some((a) =>
					a.toLowerCase().includes(searchQuery.toLowerCase())
				);

			// Filter by selected tag
			const matchesTag =
				selectedTag === null || entry.tags.includes(selectedTag);

			return matchesSearch && matchesTag;
		});
	}, [entries, searchQuery, selectedTag]);

	// Create new wiki entry
	const handleCreateEntry = useCallback(async () => {
		if (!selectedProjectId) {
			toast.error("Please select a project first");
			return;
		}

		try {
			const newEntry = await createWikiEntry({
				projectId: selectedProjectId,
				name: `New Entry ${entries.length + 1}`,
			});
			onSelectEntry?.(newEntry);
			toast.success("New wiki entry created");
		} catch (error) {
			console.error("Failed to create wiki entry:", error);
			toast.error("Failed to create wiki entry");
		}
	}, [selectedProjectId, entries.length, onSelectEntry]);

	// Delete wiki entry
	const handleDeleteEntry = useCallback(
		async (entryId: string, entryName: string) => {
			if (!window.confirm(`Delete "${entryName}"?`)) {
				return;
			}
			try {
				await deleteWikiEntry(entryId);
				toast.success("Wiki entry deleted");
			} catch (error) {
				console.error("Failed to delete wiki entry:", error);
				toast.error("Failed to delete wiki entry");
			}
		},
		[]
	);

	// Clear tag filter
	const handleClearTagFilter = useCallback(() => {
		setSelectedTag(null);
	}, []);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="h-12 flex items-center justify-between px-4 border-b border-sidebar-border/20">
				<div className="flex items-center gap-2 font-semibold text-foreground/80">
					<BookOpen className="size-5" />
					<span>Wiki</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={handleCreateEntry}
					title="Create new wiki entry"
					disabled={!selectedProjectId}
				>
					<Plus className="size-4" />
				</Button>
			</div>

			{/* Search */}
			<div className="p-3 border-b border-sidebar-border/20">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search wiki entries..."
						className="pl-9 h-8"
						disabled={!selectedProjectId}
					/>
				</div>
			</div>

			{/* Tag Filter */}
			{allTags.length > 0 && (
				<div className="px-3 py-2 border-b border-sidebar-border/20">
					<div className="flex items-center gap-1 flex-wrap">
						<Tag className="size-3 text-muted-foreground mr-1" />
						{selectedTag && (
							<Badge
								variant="secondary"
								className="cursor-pointer text-xs"
								onClick={handleClearTagFilter}
							>
								{selectedTag} ×
							</Badge>
						)}
						{!selectedTag &&
							allTags.slice(0, 5).map((tag) => (
								<Badge
									key={tag}
									variant="outline"
									className="cursor-pointer text-xs hover:bg-secondary"
									onClick={() => setSelectedTag(tag)}
								>
									{tag}
								</Badge>
							))}
						{!selectedTag && allTags.length > 5 && (
							<span className="text-xs text-muted-foreground">
								+{allTags.length - 5} more
							</span>
						)}
					</div>
				</div>
			)}

			<Separator className="opacity-30" />

			{/* Content Area */}
			<ScrollArea className="flex-1">
				<div className="px-2 py-4">
					{!selectedProjectId ? (
						// No project selected
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<BookOpen className="size-12 mb-3 opacity-20" />
							<p className="text-sm text-center">
								Select a project to view wiki entries
							</p>
						</div>
					) : filteredEntries.length === 0 ? (
						// No entries
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<BookOpen className="size-12 mb-3 opacity-20" />
							<p className="text-sm text-center">
								{searchQuery || selectedTag
									? "No entries match your search"
									: "No wiki entries yet"}
							</p>
							{!searchQuery && !selectedTag && (
								<Button
									variant="outline"
									size="sm"
									className="mt-3"
									onClick={handleCreateEntry}
								>
									<Plus className="size-4 mr-1" />
									Create Entry
								</Button>
							)}
						</div>
					) : (
						// Entry list
						<div className="space-y-1">
							{/* List header */}
							<div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
								Entries ({filteredEntries.length})
							</div>

							{filteredEntries.map((entry) => (
								<WikiEntryListItem
									key={entry.id}
									entry={entry}
									isSelected={selectedEntryId === entry.id}
									onSelect={() => onSelectEntry?.(entry)}
									onDelete={() => handleDeleteEntry(entry.id, entry.name)}
								/>
							))}

							{/* Create new entry button */}
							<button
								className="w-full mt-2 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/50 justify-center group py-3 px-3 rounded-md flex items-center gap-2 transition-all"
								onClick={handleCreateEntry}
							>
								<Plus className="size-4 group-hover:scale-110 transition-transform" />
								<span>Create New Entry</span>
							</button>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

interface WikiEntryListItemProps {
	entry: WikiEntryInterface;
	isSelected: boolean;
	onSelect: () => void;
	onDelete: () => void;
}

function WikiEntryListItem({
	entry,
	isSelected,
	onSelect,
	onDelete,
}: WikiEntryListItemProps) {
	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onDelete();
		},
		[onDelete]
	);

	return (
		<div
			className={cn(
				"group flex items-start gap-3 h-auto py-3 px-3 rounded-md cursor-pointer transition-all",
				isSelected
					? "bg-primary/10 text-primary"
					: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
			)}
			onClick={onSelect}
		>
			<div className="shrink-0 mt-0.5 text-emerald-500">
				<BookOpen className="size-4" />
			</div>
			<div className="flex flex-col items-start gap-0.5 overflow-hidden flex-1">
				<span className="text-sm font-medium leading-tight truncate w-full">
					{entry.name}
				</span>
				{entry.alias.length > 0 && (
					<span className="text-xs text-muted-foreground/70 truncate w-full font-light">
						aka: {entry.alias.join(", ")}
					</span>
				)}
				{entry.tags.length > 0 && (
					<div className="flex gap-1 mt-1 flex-wrap">
						{entry.tags.slice(0, 3).map((tag) => (
							<Badge
								key={tag}
								variant="outline"
								className="text-[10px] px-1 py-0 h-4"
							>
								{tag}
							</Badge>
						))}
						{entry.tags.length > 3 && (
							<span className="text-[10px] text-muted-foreground">
								+{entry.tags.length - 3}
							</span>
						)}
					</div>
				)}
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
				onClick={handleDelete}
				title="Delete entry"
			>
				<Trash2 className="size-3" />
			</Button>
		</div>
	);
}
