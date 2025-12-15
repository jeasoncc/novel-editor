/**
 * Tag Model - Unified Export
 *
 * Re-exports all tag-related types, schemas, builders, repositories, and hooks.
 *
 * @requirements 2.1
 */

// Interfaces
export * from "./tag.interface";
export * from "./node-tag.interface";
export * from "./tag-relation.interface";

// Schemas
export * from "./tag.schema";

// Builders
export { TagBuilder, NodeTagBuilder, TagRelationBuilder } from "./tag.builder";

// Repository
export {
  TagRepository,
  NodeTagRepository,
  TagRelationRepository,
  getTagGraph,
  getTagsWithStats,
  type TagGraphData,
} from "./tag.repository";

// Hooks
export {
  useTagsByWorkspace,
  useTag,
  useTagsByCategory,
  useNodeTags,
  useNodeTagRelations,
  useNodesWithTag,
  useTagRelations,
  useTagRelationsForTag,
  useTagGraph,
  useTagsWithStats,
  useTagSearch,
  useTagUsageCount,
} from "./tag.hooks";
