/**
 * Edit Tag Dialog - 编辑标签对话框
 */

import { useState, useEffect } from "react";
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
  updateTag,
  type TagInterface,
  type TagCategory,
  TAG_CATEGORY_LABELS,
  TAG_CATEGORY_COLORS,
} from "@/services/tags";

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: TagInterface;
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

export function EditTagDialog({
  open,
  onOpenChange,
  tag,
}: EditTagDialogProps) {
  const [name, setName] = useState(tag.name);
  const [category, setCategory] = useState<TagCategory>(tag.category);
  const [color, setColor] = useState(tag.color);
  const [description, setDescription] = useState(tag.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when tag changes
  useEffect(() => {
    setName(tag.name);
    setCategory(tag.category);
    setColor(tag.color);
    setDescription(tag.description || "");
  }, [tag]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateTag(tag.id, {
        name: name.trim(),
        category,
        color,
        description: description.trim() || undefined,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name">名称</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入标签名称"
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>类别</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TagCategory)}>
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
            <Label htmlFor="edit-description">描述（可选）</Label>
            <Textarea
              id="edit-description"
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
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
