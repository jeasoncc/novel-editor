/**
 * NodeTag Interface Definitions
 *
 * Defines the NodeTagInterface for the many-to-many relationship
 * between nodes and tags.
 *
 * @requirements 2.1
 */

import type { UUID, ISODateString } from "../shared";

/**
 * NodeTag interface for the node_tags junction table
 *
 * This interface represents the relationship between a node and a tag.
 * It tracks:
 * - Which tags are applied to which nodes
 * - How many times a tag is mentioned in a node
 * - Optionally, the positions of mentions in the content
 */
export interface NodeTagInterface {
  /** Unique identifier for the relationship */
  id: UUID;

  /** Reference to the node */
  nodeId: UUID;

  /** Reference to the tag */
  tagId: UUID;

  /** Number of times this tag is mentioned in the node */
  mentions: number;

  /** JSON array of position objects: [{start, end}] */
  positions?: string;

  /** Creation timestamp in ISO 8601 format */
  createDate: ISODateString;
}

/**
 * NodeTag creation input type
 */
export interface NodeTagCreateInput {
  nodeId: UUID;
  tagId: UUID;
  mentions?: number;
  positions?: string;
}

/**
 * NodeTag update input type
 */
export interface NodeTagUpdateInput {
  mentions?: number;
  positions?: string;
}

/**
 * Position in content where tag is mentioned
 */
export interface TagPosition {
  start: number;
  end: number;
}
