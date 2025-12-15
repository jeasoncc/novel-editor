/**
 * Tag Builders
 *
 * Implements the Builder pattern for creating Tag, NodeTag, and TagRelation objects.
 *
 * @requirements 3.1, 3.2
 */

import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import type { TagInterface, TagCategory } from "./tag.interface";
import type { NodeTagInterface, TagPosition } from "./node-tag.interface";
import type { TagRelationInterface, RelationType } from "./tag-relation.interface";
import { TagSchema, NodeTagSchema, TagRelationSchema } from "./tag.schema";

// Default colors for each category
const DEFAULT_COLORS: Record<TagCategory, string> = {
  character: "#FF6B6B",  // 红色 - 角色
  location: "#4ECDC4",   // 青色 - 地点
  item: "#FFE66D",       // 黄色 - 物品
  event: "#95E1D3",      // 绿色 - 事件
  theme: "#DDA0DD",      // 紫色 - 主题
  custom: "#A8A8A8",     // 灰色 - 自定义
};

// ============================================
// TagBuilder
// ============================================

export class TagBuilder {
  private data: Partial<TagInterface> = {};

  constructor() {
    const now = dayjs().toISOString();
    this.data = {
      id: uuidv4(),
      color: DEFAULT_COLORS.custom,
      category: "custom",
      createDate: now,
      lastEdit: now,
    };
  }

  workspace(id: string): this {
    this.data.workspace = id;
    return this;
  }

  name(name: string): this {
    this.data.name = name;
    return this;
  }

  color(color: string): this {
    this.data.color = color;
    return this;
  }

  category(category: TagCategory): this {
    this.data.category = category;
    // Auto-set color if not explicitly set
    if (this.data.color === DEFAULT_COLORS.custom) {
      this.data.color = DEFAULT_COLORS[category];
    }
    return this;
  }

  icon(icon: string): this {
    this.data.icon = icon;
    return this;
  }

  description(description: string): this {
    this.data.description = description;
    return this;
  }

  metadata(metadata: Record<string, unknown>): this {
    this.data.metadata = JSON.stringify(metadata);
    return this;
  }

  id(id: string): this {
    this.data.id = id;
    return this;
  }

  build(): TagInterface {
    this.data.lastEdit = dayjs().toISOString();
    return TagSchema.parse(this.data) as TagInterface;
  }

  reset(): this {
    const now = dayjs().toISOString();
    this.data = {
      id: uuidv4(),
      color: DEFAULT_COLORS.custom,
      category: "custom",
      createDate: now,
      lastEdit: now,
    };
    return this;
  }
}

// ============================================
// NodeTagBuilder
// ============================================

export class NodeTagBuilder {
  private data: Partial<NodeTagInterface> = {};

  constructor() {
    this.data = {
      id: uuidv4(),
      mentions: 1,
      createDate: dayjs().toISOString(),
    };
  }

  nodeId(id: string): this {
    this.data.nodeId = id;
    return this;
  }

  tagId(id: string): this {
    this.data.tagId = id;
    return this;
  }

  mentions(count: number): this {
    this.data.mentions = count;
    return this;
  }

  positions(positions: TagPosition[]): this {
    this.data.positions = JSON.stringify(positions);
    return this;
  }

  id(id: string): this {
    this.data.id = id;
    return this;
  }

  build(): NodeTagInterface {
    return NodeTagSchema.parse(this.data) as NodeTagInterface;
  }

  reset(): this {
    this.data = {
      id: uuidv4(),
      mentions: 1,
      createDate: dayjs().toISOString(),
    };
    return this;
  }
}

// ============================================
// TagRelationBuilder
// ============================================

export class TagRelationBuilder {
  private data: Partial<TagRelationInterface> = {};

  constructor() {
    this.data = {
      id: uuidv4(),
      relationType: "related",
      weight: 50,
      createDate: dayjs().toISOString(),
    };
  }

  workspace(id: string): this {
    this.data.workspace = id;
    return this;
  }

  sourceTagId(id: string): this {
    this.data.sourceTagId = id;
    return this;
  }

  targetTagId(id: string): this {
    this.data.targetTagId = id;
    return this;
  }

  relationType(type: RelationType): this {
    this.data.relationType = type;
    return this;
  }

  weight(weight: number): this {
    this.data.weight = Math.max(0, Math.min(100, weight));
    return this;
  }

  description(description: string): this {
    this.data.description = description;
    return this;
  }

  id(id: string): this {
    this.data.id = id;
    return this;
  }

  build(): TagRelationInterface {
    return TagRelationSchema.parse(this.data) as TagRelationInterface;
  }

  reset(): this {
    this.data = {
      id: uuidv4(),
      relationType: "related",
      weight: 50,
      createDate: dayjs().toISOString(),
    };
    return this;
  }
}
