/**
 * Tag Interface Definitions
 *
 * Defines the TagInterface for the tag system.
 * Tags can be used to categorize and link content across nodes.
 *
 * @requirements 2.1
 */

import type { UUID, ISODateString } from "../shared";

/**
 * Tag category enumeration
 * Defines the different categories of tags
 */
export type TagCategory =
  | "character"  // 角色
  | "location"   // 地点
  | "item"       // 物品
  | "event"      // 事件
  | "theme"      // 主题
  | "custom";    // 自定义

/**
 * Tag interface for the tags table
 *
 * This interface represents a tag definition that can be:
 * - Applied to multiple nodes
 * - Linked to other tags via relations
 * - Visualized in a graph view
 */
export interface TagInterface {
  /** Unique identifier for the tag */
  id: UUID;

  /** Workspace/project this tag belongs to */
  workspace: UUID;

  /** Tag display name */
  name: string;

  /** Tag color for visualization (hex format) */
  color: string;

  /** Tag category for grouping */
  category: TagCategory;

  /** Optional icon name (lucide icon) */
  icon?: string;

  /** Optional description */
  description?: string;

  /** Optional metadata as JSON string */
  metadata?: string;

  /** Creation timestamp in ISO 8601 format */
  createDate: ISODateString;

  /** Last modification timestamp in ISO 8601 format */
  lastEdit: ISODateString;
}

/**
 * Tag creation input type
 */
export interface TagCreateInput {
  workspace: UUID;
  name: string;
  color?: string;
  category?: TagCategory;
  icon?: string;
  description?: string;
  metadata?: string;
}

/**
 * Tag update input type
 */
export interface TagUpdateInput {
  name?: string;
  color?: string;
  category?: TagCategory;
  icon?: string;
  description?: string;
  metadata?: string;
}
