/**
 * Create Tag Dialog - 创建标签对话框
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTag,
  type TagCategory,
  TAG_CATEGORY_LABELS,
  TAG_CATEGORY_COLORS,
} from "@/services/tags";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

const PRESET_COLORS = [
  "#FF6B6B", // 红
  "#FF8E53", // 橙
  "#FFE66D", // 黄
  "#95E1D3", // 绿
  "#4ECDC4", // 青
  "#45B7D1", // 蓝
  "#DDA0DD", // 紫
  "#F8B4D9", // 粉
  "#A8A8A8", // 灰
  "#2D3436", // 黑
];

export function CreateTagDialog({
  open,
  onOpenChange,
  workspaceId,
}: CreateTagDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TagCategory>("custom");
  const [color, setColor] = useState(TAG_CATEGORY_COLORS.custom);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (value: TagCategory) => {
    setCategory(value);
    setColor(TAG_CATEGORY_COLORS[value]);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createTag({
        workspace: workspaceId,
        name: name.trim(),
        category,
        color,
        description: description.trim() || undefined,
      });
      onOpenChange(false);
      // Reset form
      setName("");
      setCategory("custom");
      setColor(TAG_CATEGORY_COLORS.custom);
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建标签</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入标签名称"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>类别</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TAG_CATEGORY_LABELS) as TagCategory[]).map(
                  (cat) => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: TAG_CATEGORY_COLORS[cat] }}
                        />
                        {TAG_CATEGORY_LABELS[cat]}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="grid gap-2">
            <Label>颜色</Label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`size-6 rounded-md transition-all ${
                      color === c
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-8 p-0 border-0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">描述（可选）</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入标签描述"
              rows={2}
            />
          </div>

          {/* Preview */}
          <div className="grid gap-2">
            <Label>预览</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <span
                className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}40`,
                }}
              >
                #[{name || "标签名称"}]
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? "创建中..." : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
