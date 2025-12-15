/**
 * Tags Panel - 标签管理面板
 *
 * 功能：
 * - 显示当前工作区所有标签
 * - 按类别分组
 * - 创建/编辑/删除标签
 * - 显示标签使用统计
 */

import { useState, useMemo } from "react";
import {
  Tag,
  User,
  MapPin,
  Package,
  Calendar,
  Lightbulb,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  useTagsWithStats,
  type TagInterface,
  type TagCategory,
  TAG_CATEGORY_LABELS,
  deleteTag,
} from "@/services/tags";
import { useSelectionStore } from "@/stores/selection";
import { CreateTagDialog } from "./create-tag-dialog";
import { EditTagDialog } from "./edit-tag-dialog";

// 类别图标映射
const CATEGORY_ICONS: Record<TagCategory, React.ReactNode> = {
  character: <User className="size-4" />,
  location: <MapPin className="size-4" />,
  item: <Package className="size-4" />,
  event: <Calendar className="size-4" />,
  theme: <Lightbulb className="size-4" />,
  custom: <Tag className="size-4" />,
};

// 类别顺序
const CATEGORY_ORDER: TagCategory[] = [
  "character",
  "location",
  "item",
  "event",
  "theme",
  "custom",
];

interface TagItemProps {
  tag: TagInterface & { usageCount: number };
  onEdit: (tag: TagInterface) => void;
  onDelete: (tag: TagInterface) => void;
}

function TagItem({ tag, onEdit, onDelete }: TagItemProps) {
  return (
    <div className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors">
      <div
        className="size-3 rounded-full shrink-0"
        style={{ backgroundColor: tag.color }}
      />
      <span className="flex-1 text-sm truncate">{tag.name}</span>
      <span className="text-xs text-muted-foreground">{tag.usageCount}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
            <MoreHorizontal className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(tag)}>
            <Pencil className="size-4 mr-2" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(tag)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface CategoryGroupProps {
  category: TagCategory;
  tags: Array<TagInterface & { usageCount: number }>;
  onEdit: (tag: TagInterface) => void;
  onDelete: (tag: TagInterface) => void;
}

function CategoryGroup({ category, tags, onEdit, onDelete }: CategoryGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (tags.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        {isOpen ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
        <span
          className="flex items-center gap-1.5"
          style={{ color: tags[0]?.color }}
        >
          {CATEGORY_ICONS[category]}
          {TAG_CATEGORY_LABELS[category]}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {tags.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 space-y-0.5">
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function TagsPanel() {
  const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
  const tagsWithStats = useTagsWithStats(selectedProjectId);

  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagInterface | null>(null);

  // 按类别分组并过滤
  const groupedTags = useMemo(() => {
    const tags = tagsWithStats || [];
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? tags.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query)
        )
      : tags;

    const groups: Record<TagCategory, Array<TagInterface & { usageCount: number }>> = {
      character: [],
      location: [],
      item: [],
      event: [],
      theme: [],
      custom: [],
    };

    for (const tag of filtered) {
      groups[tag.category].push(tag);
    }

    // 每个组内按使用次数排序
    for (const category of CATEGORY_ORDER) {
      groups[category].sort((a, b) => b.usageCount - a.usageCount);
    }

    return groups;
  }, [tagsWithStats, searchQuery]);

  const totalTags = tagsWithStats?.length || 0;

  const handleEdit = (tag: TagInterface) => {
    setEditingTag(tag);
  };

  const handleDelete = async (tag: TagInterface) => {
    if (confirm(`确定要删除标签 "${tag.name}" 吗？`)) {
      await deleteTag(tag.id);
    }
  };

  if (!selectedProjectId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Tag className="size-12 mb-3 opacity-20" />
        <p className="text-sm text-center">请先选择一个工作区</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Tag className="size-5" />
          <span className="font-semibold">标签</span>
          <span className="text-xs text-muted-foreground">({totalTags})</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8"
          />
        </div>
      </div>

      {/* Tag List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {totalTags === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Tag className="size-12 mb-3 opacity-20" />
            <p className="text-sm text-center">还没有标签</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4 mr-1" />
              创建标签
            </Button>
          </div>
        ) : (
          CATEGORY_ORDER.map((category) => (
            <CategoryGroup
              key={category}
              category={category}
              tags={groupedTags[category]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateTagDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={selectedProjectId}
      />

      {editingTag && (
        <EditTagDialog
          open={!!editingTag}
          onOpenChange={(open: boolean) => !open && setEditingTag(null)}
          tag={editingTag}
        />
      )}
    </div>
  );
}
