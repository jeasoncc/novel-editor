/**
 * Tag Zod Schemas
 *
 * Provides Zod validation schemas for Tag, NodeTag, and TagRelation.
 *
 * @requirements 2.2
 */

import { z } from "zod";

// ============================================
// Tag Schemas
// ============================================

export const TagCategorySchema = z.enum([
  "character",
  "location",
  "item",
  "event",
  "theme",
  "custom",
]);

export const TagSchema = z.object({
  id: z.string().uuid(),
  workspace: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  category: TagCategorySchema,
  icon: z.string().optional(),
  description: z.string().max(500).optional(),
  metadata: z.string().optional(),
  createDate: z.string().datetime(),
  lastEdit: z.string().datetime(),
});

export const TagCreateSchema = z.object({
  workspace: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  category: TagCategorySchema.optional(),
  icon: z.string().optional(),
  description: z.string().max(500).optional(),
  metadata: z.string().optional(),
});

export const TagUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  category: TagCategorySchema.optional(),
  icon: z.string().optional(),
  description: z.string().max(500).optional(),
  metadata: z.string().optional(),
});

// ============================================
// NodeTag Schemas
// ============================================

export const NodeTagSchema = z.object({
  id: z.string().uuid(),
  nodeId: z.string().uuid(),
  tagId: z.string().uuid(),
  mentions: z.number().int().min(0),
  positions: z.string().optional(),
  createDate: z.string().datetime(),
});

export const NodeTagCreateSchema = z.object({
  nodeId: z.string().uuid(),
  tagId: z.string().uuid(),
  mentions: z.number().int().min(0).optional(),
  positions: z.string().optional(),
});

export const NodeTagUpdateSchema = z.object({
  mentions: z.number().int().min(0).optional(),
  positions: z.string().optional(),
});

// ============================================
// TagRelation Schemas
// ============================================

export const RelationTypeSchema = z.enum([
  "related",
  "parent",
  "child",
  "conflict",
  "alias",
  "belongs",
  "owns",
  "knows",
  "custom",
]);

export const TagRelationSchema = z.object({
  id: z.string().uuid(),
  workspace: z.string().uuid(),
  sourceTagId: z.string().uuid(),
  targetTagId: z.string().uuid(),
  relationType: RelationTypeSchema,
  weight: z.number().int().min(0).max(100),
  description: z.string().max(500).optional(),
  createDate: z.string().datetime(),
});

export const TagRelationCreateSchema = z.object({
  workspace: z.string().uuid(),
  sourceTagId: z.string().uuid(),
  targetTagId: z.string().uuid(),
  relationType: RelationTypeSchema.optional(),
  weight: z.number().int().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const TagRelationUpdateSchema = z.object({
  relationType: RelationTypeSchema.optional(),
  weight: z.number().int().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
});
