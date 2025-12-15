/**
 * TagRelation Interface Definitions
 *
 * Defines the TagRelationInterface for relationships between tags.
 * Used for building knowledge graphs and visualizations.
 *
 * @requirements 2.1
 */

import type { UUID, ISODateString } from "../shared";

/**
 * Relation type enumeration
 * Defines the different types of relationships between tags
 */
export type RelationType =
  | "related"    // 相关
  | "parent"     // 父级（如：角色 -> 组织）
  | "child"      // 子级
  | "conflict"   // 冲突/对立
  | "alias"      // 别名
  | "belongs"    // 属于
  | "owns"       // 拥有
  | "knows"      // 认识
  | "custom";    // 自定义

/**
 * TagRelation interface for the tag_relations table
 *
 * This interface represents a directed relationship between two tags.
 * Used for:
 * - Building knowledge graphs
 * - Visualizing tag relationships
 * - Inferring connections between content
 */
export interface TagRelationInterface {
  /** Unique identifier for the relationship */
  id: UUID;

  /** Workspace this relation belongs to */
  workspace: UUID;

  /** Source tag ID (from) */
  sourceTagId: UUID;

  /** Target tag ID (to) */
  targetTagId: UUID;

  /** Type of relationship */
  relationType: RelationType;

  /** Relationship strength/weight (0-100) */
  weight: number;

  /** Optional description of the relationship */
  description?: string;

  /** Creation timestamp in ISO 8601 format */
  createDate: ISODateString;
}

/**
 * TagRelation creation input type
 */
export interface TagRelationCreateInput {
  workspace: UUID;
  sourceTagId: UUID;
  targetTagId: UUID;
  relationType?: RelationType;
  weight?: number;
  description?: string;
}

/**
 * TagRelation update input type
 */
export interface TagRelationUpdateInput {
  relationType?: RelationType;
  weight?: number;
  description?: string;
}
