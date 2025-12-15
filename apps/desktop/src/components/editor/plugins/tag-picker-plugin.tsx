/**
 * Tag Picker Plugin - 支持 #[ 插入标签
 *
 * 功能：
 * - 输入 #[ 触发标签选择器
 * - 支持搜索现有标签
 * - 支持创建新标签
 * - 按类别分组显示
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $getSelection, $isRangeSelection, type TextNode } from "lexical";
import {
  Tag,
  User,
  MapPin,
  Package,
  Calendar,
  Lightbulb,
  Plus,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";

import { $createTagNode } from "@/components/editor/nodes/tag-node";
import {
  useTagsByWorkspace,
  type TagInterface,
  type TagCategory,
  TAG_CATEGORY_COLORS,
  TAG_CATEGORY_LABELS,
  createTag,
} from "@/services/tags";
import { useSelectionStore } from "@/stores/selection";

// 匹配 #[ 开头的输入
const TagTriggerRegex = /#\[([\u4e00-\u9fa5a-zA-Z0-9_\s]*)$/;

const SUGGESTION_LIST_LENGTH_LIMIT = 10;

// 类别图标映射
const CATEGORY_ICONS: Record<TagCategory, React.ReactNode> = {
  character: <User className="size-4" />,
  location: <MapPin className="size-4" />,
  item: <Package className="size-4" />,
  event: <Calendar className="size-4" />,
  theme: <Lightbulb className="size-4" />,
  custom: <Tag className="size-4" />,
};

class TagTypeaheadOption extends MenuOption {
  tag: TagInterface | null;
  isCreateNew: boolean;
  createName: string;

  constructor(
    key: string,
    tag: TagInterface | null,
    isCreateNew: boolean = false,
    createName: string = ""
  ) {
    super(key);
    this.tag = tag;
    this.isCreateNew = isCreateNew;
    this.createName = createName;
  }
}

function TagTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: TagTypeaheadOption;
}) {
  if (option.isCreateNew) {
    return (
      <li
        key={option.key}
        tabIndex={-1}
        ref={option.setRefElement}
        role="option"
        aria-selected={isSelected}
        id={"typeahead-item-" + index}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md
          transition-colors duration-150 border-t border-border mt-1 pt-3
          ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
        `}
      >
        <div className="flex items-center justify-center size-8 rounded-full bg-green-500/10 shrink-0">
          <Plus className="size-4 text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            创建标签 "{option.createName}"
          </div>
          <div className="text-xs text-muted-foreground">
            按 Enter 创建新标签
          </div>
        </div>
      </li>
    );
  }

  const { tag } = option;
  if (!tag) return null;

  return (
    <li
      key={option.key}
      tabIndex={-1}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md
        transition-colors duration-150
        ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
      `}
    >
      <div
        className="flex items-center justify-center size-8 rounded-full shrink-0"
        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
      >
        {CATEGORY_ICONS[tag.category]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{tag.name}</div>
        {tag.description && (
          <div className="text-xs text-muted-foreground truncate">
            {tag.description}
          </div>
        )}
      </div>
      <div
        className="text-xs px-2 py-0.5 rounded-full shrink-0"
        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
      >
        {TAG_CATEGORY_LABELS[tag.category]}
      </div>
    </li>
  );
}

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

function checkForTagTrigger(text: string): MenuTextMatch | null {
  const match = TagTriggerRegex.exec(text);

  if (match !== null) {
    return {
      leadOffset: match.index,
      matchingString: match[1] || "",
      replaceableString: match[0],
    };
  }

  return null;
}

export default function TagPickerPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
  const tags = useTagsByWorkspace(selectedProjectId);

  const [queryString, setQueryString] = useState<string | null>(null);

  const options = useMemo(() => {
    const allTags = tags || [];
    const query = (queryString || "").toLowerCase().trim();

    let filtered: TagInterface[];

    if (!query) {
      // 没有查询时显示所有标签
      filtered = allTags.slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
    } else {
      // 过滤匹配的标签
      filtered = allTags
        .filter((tag) => {
          // 匹配名称
          if (tag.name.toLowerCase().includes(query)) return true;
          // 匹配描述
          if (tag.description?.toLowerCase().includes(query)) return true;
          // 匹配类别
          if (TAG_CATEGORY_LABELS[tag.category].includes(query)) return true;
          return false;
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT - 1); // 留一个位置给"创建新标签"
    }

    const result: TagTypeaheadOption[] = filtered.map(
      (tag) => new TagTypeaheadOption(tag.id, tag)
    );

    // 如果有查询且没有完全匹配的标签，添加"创建新标签"选项
    if (query && !allTags.some((t) => t.name.toLowerCase() === query)) {
      result.push(
        new TagTypeaheadOption(`create-${query}`, null, true, query)
      );
    }

    return result;
  }, [tags, queryString]);

  const onSelectOption = useCallback(
    async (
      selectedOption: TagTypeaheadOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      let tag = selectedOption.tag;

      // 如果是创建新标签
      if (selectedOption.isCreateNew && selectedProjectId) {
        tag = await createTag({
          workspace: selectedProjectId,
          name: selectedOption.createName,
          category: "custom",
        });
      }

      if (!tag) {
        closeMenu();
        return;
      }

      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        const tagNode = $createTagNode(
          tag.name,
          tag.id,
          tag.color,
          tag.category
        );
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([tagNode]);
        }
        closeMenu();
      });
    },
    [editor, selectedProjectId]
  );

  const checkForTagMatch = useCallback((text: string) => {
    return checkForTagTrigger(text);
  }, []);

  return (
    <LexicalTypeaheadMenuPlugin<TagTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTagMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (!anchorElementRef.current || options.length === 0) {
          return null;
        }

        return ReactDOM.createPortal(
          <div className="z-[9999] bg-popover border border-border rounded-lg shadow-xl p-1.5 min-w-[280px] max-w-[360px] max-h-[320px] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1 flex items-center gap-2">
              <Tag className="size-3" />
              {queryString ? `搜索 "${queryString}"` : "选择或创建标签"}
            </div>
            <ul className="space-y-0.5">
              {options.map((option, i: number) => (
                <TagTypeaheadMenuItem
                  index={i}
                  isSelected={selectedIndex === i}
                  onClick={() => {
                    setHighlightedIndex(i);
                    selectOptionAndCleanUp(option);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(i);
                  }}
                  key={option.key}
                  option={option}
                />
              ))}
            </ul>
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1">
              ↑↓ 选择 · ↵ 确认 · Esc 取消
            </div>
          </div>,
          anchorElementRef.current
        );
      }}
    />
  );
}
