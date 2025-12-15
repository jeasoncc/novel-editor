/**
 * Tag Node - 用于 #[ 标签引用
 *
 * 在编辑器中显示为彩色标签，支持：
 * - 点击跳转到标签详情
 * - 悬停显示标签信息
 * - 自动同步到数据库
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";

export type SerializedTagNode = Spread<
  {
    tagName: string;
    tagId: string;
    tagColor: string;
    tagCategory: string;
  },
  SerializedTextNode
>;

function convertTagElement(domNode: HTMLElement): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const tagId = domNode.getAttribute("data-tag-id");
  const tagColor = domNode.getAttribute("data-tag-color") || "#A8A8A8";
  const tagCategory = domNode.getAttribute("data-tag-category") || "custom";

  if (textContent !== null && tagId !== null) {
    const node = $createTagNode(textContent.replace(/^#\[|\]$/g, ""), tagId, tagColor, tagCategory);
    return { node };
  }

  return null;
}

export class TagNode extends TextNode {
  __tagName: string;
  __tagId: string;
  __tagColor: string;
  __tagCategory: string;

  static getType(): string {
    return "tag";
  }

  static clone(node: TagNode): TagNode {
    return new TagNode(
      node.__tagName,
      node.__tagId,
      node.__tagColor,
      node.__tagCategory,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedTagNode): TagNode {
    const node = $createTagNode(
      serializedNode.tagName,
      serializedNode.tagId,
      serializedNode.tagColor,
      serializedNode.tagCategory
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(
    tagName: string,
    tagId: string,
    tagColor: string = "#A8A8A8",
    tagCategory: string = "custom",
    key?: NodeKey
  ) {
    super(`#[${tagName}]`, key);
    this.__tagName = tagName;
    this.__tagId = tagId;
    this.__tagColor = tagColor;
    this.__tagCategory = tagCategory;
  }

  exportJSON(): SerializedTagNode {
    return {
      ...super.exportJSON(),
      tagName: this.__tagName,
      tagId: this.__tagId,
      tagColor: this.__tagColor,
      tagCategory: this.__tagCategory,
      type: "tag",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);

    // 根据颜色计算文字颜色（深色背景用白字，浅色背景用黑字）
    const bgColor = this.__tagColor;
    const textColor = getContrastColor(bgColor);

    dom.className = "tag-node";
    dom.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 0 6px;
      margin: 0 2px;
      border-radius: 4px;
      font-size: 0.875em;
      font-weight: 500;
      background-color: ${bgColor}20;
      color: ${bgColor};
      border: 1px solid ${bgColor}40;
      cursor: pointer;
      transition: all 0.15s ease;
    `;

    dom.setAttribute("data-tag-id", this.__tagId);
    dom.setAttribute("data-tag-name", this.__tagName);
    dom.setAttribute("data-tag-color", this.__tagColor);
    dom.setAttribute("data-tag-category", this.__tagCategory);

    // 添加悬停效果
    dom.addEventListener("mouseenter", () => {
      dom.style.backgroundColor = `${bgColor}30`;
      dom.style.borderColor = `${bgColor}60`;
    });
    dom.addEventListener("mouseleave", () => {
      dom.style.backgroundColor = `${bgColor}20`;
      dom.style.borderColor = `${bgColor}40`;
    });

    return dom;
  }

  updateDOM(prevNode: TagNode, dom: HTMLElement, config: EditorConfig): boolean {
    // 如果颜色或类别改变，需要更新 DOM
    if (
      prevNode.__tagColor !== this.__tagColor ||
      prevNode.__tagCategory !== this.__tagCategory
    ) {
      return true;
    }
    return super.updateDOM(prevNode, dom, config);
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-tag-id", this.__tagId);
    element.setAttribute("data-tag-name", this.__tagName);
    element.setAttribute("data-tag-color", this.__tagColor);
    element.setAttribute("data-tag-category", this.__tagCategory);
    element.className = "tag-node";
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-tag-id")) {
          return null;
        }
        return {
          conversion: convertTagElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  getTagName(): string {
    return this.__tagName;
  }

  getTagId(): string {
    return this.__tagId;
  }

  getTagColor(): string {
    return this.__tagColor;
  }

  getTagCategory(): string {
    return this.__tagCategory;
  }

  setTagColor(color: string): void {
    const writable = this.getWritable();
    writable.__tagColor = color;
  }
}

export function $createTagNode(
  tagName: string,
  tagId: string,
  tagColor: string = "#A8A8A8",
  tagCategory: string = "custom"
): TagNode {
  const tagNode = new TagNode(tagName, tagId, tagColor, tagCategory);
  tagNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(tagNode);
}

export function $isTagNode(node: LexicalNode | null | undefined): node is TagNode {
  return node instanceof TagNode;
}

/**
 * 计算对比色（用于确定文字颜色）
 */
function getContrastColor(hexColor: string): string {
  // 移除 # 前缀
  const hex = hexColor.replace("#", "");

  // 转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 计算亮度
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 亮度大于 0.5 用深色文字，否则用浅色
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}
