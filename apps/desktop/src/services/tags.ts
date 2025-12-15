/**
 * Tag Service
 *
 * Provides high-level tag management operations.
 * Handles tag CRUD, node-tag associations, and graph data.
 *
 * @requirements 6.2
 */

import { toast } from "sonner";
import {
  TagRepository,
  NodeTagRepository,
  TagRelationRepository,
  getTagGraph,
  getTagsWithStats,
  type TagInterface,
  type TagCategory,
  type TagCreateInput,
  type TagUpdateInput,
  type NodeTagInterface,
  type TagRelationInterface,
  type RelationType,
  type TagGraphData,
  type TagPosition,
} from "@/db/models";

// Re-export hooks for convenience
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
} from "@/db/models";

// Re-export types
export type {
  TagInterface,
  TagCategory,
  TagCreateInput,
  TagUpdateInput,
  NodeTagInterface,
  TagRelationInterface,
  RelationType,
  TagGraphData,
  TagPosition,
};

// ============================================
// Tag Management
// ============================================

/**
 * Create a new tag
 */
export async function createTag(input: TagCreateInput): Promise<TagInterface> {
  const tag = await TagRepository.add(input);
  toast.success(`标签 "${tag.name}" 创建成功`);
  return tag;
}

/**
 * Update a tag
 */
export async function updateTag(id: string, updates: TagUpdateInput): Promise<void> {
  await TagRepository.update(id, updates);
  toast.success("标签已更新");
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  await TagRepository.delete(id);
  toast.success("标签已删除");
}

/**
 * Get or create a tag by name
 */
export async function getOrCreateTag(
  workspaceId: string,
  name: string,
  category?: TagCategory
): Promise<TagInterface> {
  return TagRepository.getOrCreate(workspaceId, name, category);
}

/**
 * Search tags by name
 */
export async function searchTags(workspaceId: string, query: string): Promise<TagInterface[]> {
  return TagRepository.searchByName(workspaceId, query);
}

// ============================================
// Node-Tag Association
// ============================================

/**
 * Add a tag to a node
 */
export async function addTagToNode(nodeId: string, tagId: string): Promise<NodeTagInterface> {
  return NodeTagRepository.add({ nodeId, tagId });
}

/**
 * Remove a tag from a node
 */
export async function removeTagFromNode(nodeId: string, tagId: string): Promise<void> {
  await NodeTagRepository.remove(nodeId, tagId);
}

/**
 * Sync tags for a node (replace all existing tags)
 */
export async function syncNodeTags(nodeId: string, tagIds: string[]): Promise<void> {
  await NodeTagRepository.syncForNode(nodeId, tagIds);
}

/**
 * Update tag positions in content
 */
export async function updateTagPositions(
  nodeId: string,
  tagId: string,
  positions: TagPosition[]
): Promise<void> {
  await NodeTagRepository.updatePositions(nodeId, tagId, positions);
}

/**
 * Get tag usage count
 */
export async function getTagUsageCount(tagId: string): Promise<number> {
  return NodeTagRepository.countByTagId(tagId);
}

// ============================================
// Tag Relations
// ============================================

/**
 * Create a relation between two tags
 */
export async function createTagRelation(
  workspaceId: string,
  sourceTagId: string,
  targetTagId: string,
  relationType: RelationType = "related",
  weight: number = 50
): Promise<TagRelationInterface> {
  return TagRelationRepository.add({
    workspace: workspaceId,
    sourceTagId,
    targetTagId,
    relationType,
    weight,
  });
}

/**
 * Delete a relation between two tags
 */
export async function deleteTagRelation(sourceTagId: string, targetTagId: string): Promise<void> {
  await TagRelationRepository.deleteBetween(sourceTagId, targetTagId);
}

/**
 * Update a tag relation
 */
export async function updateTagRelation(
  id: string,
  updates: { relationType?: RelationType; weight?: number; description?: string }
): Promise<void> {
  await TagRelationRepository.update(id, updates);
}

// ============================================
// Graph Data
// ============================================

/**
 * Get tag graph data for visualization
 */
export async function fetchTagGraph(workspaceId: string): Promise<TagGraphData> {
  return getTagGraph(workspaceId);
}

/**
 * Get tags with usage statistics
 */
export async function fetchTagsWithStats(
  workspaceId: string
): Promise<Array<TagInterface & { usageCount: number }>> {
  return getTagsWithStats(workspaceId);
}

// ============================================
// Content Tag Extraction
// ============================================

/**
 * Extract tags from Lexical content
 * Looks for TagNode instances in the content
 */
export function extractTagsFromContent(content: string): Array<{ tagId: string; positions: TagPosition[] }> {
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    const tagMap = new Map<string, TagPosition[]>();

    function traverse(node: any, offset: number = 0): number {
      if (!node) return offset;

      // Check if this is a tag node
      if (node.type === "tag" && node.tagId) {
        const positions = tagMap.get(node.tagId) || [];
        const length = node.tagName?.length || 0;
        positions.push({ start: offset, end: offset + length });
        tagMap.set(node.tagId, positions);
        return offset + length;
      }

      // Handle text nodes
      if (node.type === "text" && node.text) {
        return offset + node.text.length;
      }

      // Traverse children
      if (node.children && Array.isArray(node.children)) {
        let currentOffset = offset;
        for (const child of node.children) {
          currentOffset = traverse(child, currentOffset);
        }
        return currentOffset;
      }

      return offset;
    }

    traverse(parsed.root);

    return Array.from(tagMap.entries()).map(([tagId, positions]) => ({
      tagId,
      positions,
    }));
  } catch {
    return [];
  }
}

/**
 * Sync tags from content to database
 * Call this after saving content to update node-tag relations
 */
export async function syncTagsFromContent(nodeId: string, content: string): Promise<void> {
  const extracted = extractTagsFromContent(content);

  // Get current tags for this node
  const currentTags = await NodeTagRepository.getByNodeId(nodeId);
  const currentTagIds = new Set(currentTags.map((t) => t.tagId));
  const newTagIds = new Set(extracted.map((t) => t.tagId));

  // Remove tags that are no longer in content
  for (const tagId of currentTagIds) {
    if (!newTagIds.has(tagId)) {
      await NodeTagRepository.remove(nodeId, tagId);
    }
  }

  // Add or update tags from content
  for (const { tagId, positions } of extracted) {
    if (currentTagIds.has(tagId)) {
      // Update positions
      await NodeTagRepository.updatePositions(nodeId, tagId, positions);
    } else {
      // Add new tag
      await NodeTagRepository.add({
        nodeId,
        tagId,
        mentions: positions.length,
        positions: JSON.stringify(positions),
      });
    }
  }
}

// ============================================
// Default Tag Colors
// ============================================

export const TAG_CATEGORY_COLORS: Record<TagCategory, string> = {
  character: "#FF6B6B",  // 红色 - 角色
  location: "#4ECDC4",   // 青色 - 地点
  item: "#FFE66D",       // 黄色 - 物品
  event: "#95E1D3",      // 绿色 - 事件
  theme: "#DDA0DD",      // 紫色 - 主题
  custom: "#A8A8A8",     // 灰色 - 自定义
};

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  character: "角色",
  location: "地点",
  item: "物品",
  event: "事件",
  theme: "主题",
  custom: "自定义",
};

export const TAG_CATEGORY_ICONS: Record<TagCategory, string> = {
  character: "user",
  location: "map-pin",
  item: "package",
  event: "calendar",
  theme: "lightbulb",
  custom: "tag",
};
