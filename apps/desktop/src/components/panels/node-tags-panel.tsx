/**
 * Node Tags Panel - 当前节点标签面板
 *
 * 显示当前编辑节点的所有标签
 * 支持快速添加/删除标签
 */

import { useState, useMemo } from "react";
import { Tag, Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useNodeTags,
  useTagsByWorkspace,
  addTagToNode,
  removeTagFromNode,
  createTag,
  type TagInterface,
} from "@/services/tags";
import { useSelectionStore } from "@/stores/selection";

interface TagBadgeProps {
  tag: TagInterface;
  onRemove?: () => void;
  showRemove?: boolean;
}

function TagBadge({ tag, onRemove, showRemove = true }: TagBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors"
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${tag.color}40`,
      }}
    >
      {tag.name}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 rounded p-0.5 -mr-1"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

interface AddTagPopoverProps {
  nodeId: string;
  workspaceId: string;
  existingTagIds: string[];
}

function AddTagPopover({ nodeId, workspaceId, existingTagIds }: AddTagPopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const allTags = useTagsByWorkspace(workspaceId);

  const availableTags = useMemo(() => {
    const tags = allTags || [];
    const query = search.toLowerCase().trim();

    return tags
      .filter((t) => !existingTagIds.includes(t.id))
      .filter((t) => !query || t.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [allTags, existingTagIds, search]);

  const handleAddTag = async (tag: TagInterface) => {
    await addTagToNode(nodeId, tag.id);
    setOpen(false);
    setSearch("");
  };

  const handleCreateAndAdd = async () => {
    if (!search.trim()) return;
    const tag = await createTag({
      workspace: workspaceId,
      name: search.trim(),
      category: "custom",
    });
    await addTagToNode(nodeId, tag.id);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Plus className="size-3 mr-1" />
          添加标签
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索或创建标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 h-8 text-sm"
              autoFocus
            />
          </div>

          <div className="max-h-40 overflow-auto space-y-0.5">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent text-left"
              >
                <div
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-sm truncate">{tag.name}</span>
              </button>
            ))}

            {search.trim() && !availableTags.some(
              (t) => t.name.toLowerCase() === search.toLowerCase()
            ) && (
              <button
                onClick={handleCreateAndAdd}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent text-left border-t mt-1 pt-2"
              >
                <Plus className="size-3 text-green-500" />
                <span className="text-sm">创建 "{search}"</span>
              </button>
            )}

            {availableTags.length === 0 && !search.trim() && (
              <p className="text-xs text-muted-foreground text-center py-2">
                没有可用的标签
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function NodeTagsPanel() {
  const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId);
  const nodeTags = useNodeTags(selectedNodeId);

  const handleRemoveTag = async (tagId: string) => {
    if (!selectedNodeId) return;
    await removeTagFromNode(selectedNodeId, tagId);
  };

  if (!selectedProjectId || !selectedNodeId) {
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        选择一个文件以查看标签
      </div>
    );
  }

  const tags = nodeTags || [];
  const tagIds = tags.map((t) => t.id);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tag className="size-4" />
          <span>标签</span>
          {tags.length > 0 && (
            <span className="text-xs text-muted-foreground">({tags.length})</span>
          )}
        </div>
        <AddTagPopover
          nodeId={selectedNodeId}
          workspaceId={selectedProjectId}
          existingTagIds={tagIds}
        />
      </div>

      {tags.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          此文件还没有标签。在编辑器中输入 #[ 可以快速添加标签。
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => handleRemoveTag(tag.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
