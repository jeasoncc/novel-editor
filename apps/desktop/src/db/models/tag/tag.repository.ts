/**
 * Tag Repository
 *
 * Provides CRUD operations for tags, node_tags, and tag_relations tables.
 *
 * @requirements 5.2
 */

import dayjs from "dayjs";
import { database } from "../../database";
import type { TagInterface, TagCategory, TagCreateInput, TagUpdateInput } from "./tag.interface";
import type { NodeTagInterface, NodeTagCreateInput, TagPosition } from "./node-tag.interface";
import type { TagRelationInterface, TagRelationCreateInput, TagRelationUpdateInput, RelationType } from "./tag-relation.interface";
import { TagBuilder, NodeTagBuilder, TagRelationBuilder } from "./tag.builder";

// ============================================
// Tag Repository
// ============================================

export const TagRepository = {
  /**
   * Create a new tag
   */
  async add(input: TagCreateInput): Promise<TagInterface> {
    const builder = new TagBuilder()
      .workspace(input.workspace)
      .name(input.name);

    if (input.color) builder.color(input.color);
    if (input.category) builder.category(input.category);
    if (input.icon) builder.icon(input.icon);
    if (input.description) builder.description(input.description);

    const tag = builder.build();
    await database.tags.add(tag);
    return tag;
  },

  /**
   * Update an existing tag
   */
  async update(id: string, updates: TagUpdateInput): Promise<number> {
    return database.tags.update(id, {
      ...updates,
      lastEdit: dayjs().toISOString(),
    });
  },

  /**
   * Delete a tag and all its relations
   */
  async delete(id: string): Promise<void> {
    await database.transaction("rw", [database.tags, database.nodeTags, database.tagRelations], async () => {
      // Delete all node associations
      await database.nodeTags.where("tagId").equals(id).delete();
      // Delete all relations involving this tag
      await database.tagRelations.where("sourceTagId").equals(id).delete();
      await database.tagRelations.where("targetTagId").equals(id).delete();
      // Delete the tag itself
      await database.tags.delete(id);
    });
  },

  /**
   * Get a tag by ID
   */
  async getById(id: string): Promise<TagInterface | undefined> {
    return database.tags.get(id);
  },

  /**
   * Get all tags in a workspace
   */
  async getByWorkspace(workspaceId: string): Promise<TagInterface[]> {
    return database.tags.where("workspace").equals(workspaceId).toArray();
  },

  /**
   * Get tags by category in a workspace
   */
  async getByCategory(workspaceId: string, category: TagCategory): Promise<TagInterface[]> {
    return database.tags
      .where("workspace")
      .equals(workspaceId)
      .and((t) => t.category === category)
      .toArray();
  },

  /**
   * Search tags by name
   */
  async searchByName(workspaceId: string, query: string): Promise<TagInterface[]> {
    const lowerQuery = query.toLowerCase();
    return database.tags
      .where("workspace")
      .equals(workspaceId)
      .and((t) => t.name.toLowerCase().includes(lowerQuery))
      .toArray();
  },

  /**
   * Get or create a tag by name
   */
  async getOrCreate(workspaceId: string, name: string, category?: TagCategory): Promise<TagInterface> {
    const existing = await database.tags
      .where("workspace")
      .equals(workspaceId)
      .and((t) => t.name.toLowerCase() === name.toLowerCase())
      .first();

    if (existing) return existing;

    return this.add({
      workspace: workspaceId,
      name,
      category: category || "custom",
    });
  },
};

// ============================================
// NodeTag Repository
// ============================================

export const NodeTagRepository = {
  /**
   * Add a tag to a node
   */
  async add(input: NodeTagCreateInput): Promise<NodeTagInterface> {
    // Check if relation already exists
    const existing = await database.nodeTags
      .where("[nodeId+tagId]")
      .equals([input.nodeId, input.tagId])
      .first();

    if (existing) {
      // Update mentions count
      await database.nodeTags.update(existing.id, {
        mentions: (existing.mentions || 1) + 1,
      });
      return { ...existing, mentions: (existing.mentions || 1) + 1 };
    }

    const builder = new NodeTagBuilder()
      .nodeId(input.nodeId)
      .tagId(input.tagId);

    if (input.mentions) builder.mentions(input.mentions);
    if (input.positions) {
      const positions = JSON.parse(input.positions) as TagPosition[];
      builder.positions(positions);
    }

    const nodeTag = builder.build();
    await database.nodeTags.add(nodeTag);
    return nodeTag;
  },

  /**
   * Remove a tag from a node
   */
  async remove(nodeId: string, tagId: string): Promise<void> {
    await database.nodeTags
      .where("[nodeId+tagId]")
      .equals([nodeId, tagId])
      .delete();
  },

  /**
   * Get all tags for a node
   */
  async getByNodeId(nodeId: string): Promise<NodeTagInterface[]> {
    return database.nodeTags.where("nodeId").equals(nodeId).toArray();
  },

  /**
   * Get all nodes with a specific tag
   */
  async getByTagId(tagId: string): Promise<NodeTagInterface[]> {
    return database.nodeTags.where("tagId").equals(tagId).toArray();
  },

  /**
   * Update positions for a node-tag relation
   */
  async updatePositions(nodeId: string, tagId: string, positions: TagPosition[]): Promise<void> {
    const existing = await database.nodeTags
      .where("[nodeId+tagId]")
      .equals([nodeId, tagId])
      .first();

    if (existing) {
      await database.nodeTags.update(existing.id, {
        positions: JSON.stringify(positions),
        mentions: positions.length,
      });
    }
  },

  /**
   * Sync tags for a node (replace all)
   */
  async syncForNode(nodeId: string, tagIds: string[]): Promise<void> {
    await database.transaction("rw", database.nodeTags, async () => {
      // Remove existing
      await database.nodeTags.where("nodeId").equals(nodeId).delete();
      // Add new
      for (const tagId of tagIds) {
        await this.add({ nodeId, tagId });
      }
    });
  },

  /**
   * Delete all tags for a node
   */
  async deleteByNodeId(nodeId: string): Promise<void> {
    await database.nodeTags.where("nodeId").equals(nodeId).delete();
  },

  /**
   * Count nodes using a tag
   */
  async countByTagId(tagId: string): Promise<number> {
    return database.nodeTags.where("tagId").equals(tagId).count();
  },
};

// ============================================
// TagRelation Repository
// ============================================

export const TagRelationRepository = {
  /**
   * Create a relation between two tags
   */
  async add(input: TagRelationCreateInput): Promise<TagRelationInterface> {
    // Check if relation already exists
    const existing = await database.tagRelations
      .where("[sourceTagId+targetTagId]")
      .equals([input.sourceTagId, input.targetTagId])
      .first();

    if (existing) {
      // Update existing relation
      await database.tagRelations.update(existing.id, {
        relationType: input.relationType || existing.relationType,
        weight: input.weight ?? existing.weight,
      });
      return { ...existing, ...input };
    }

    const builder = new TagRelationBuilder()
      .workspace(input.workspace)
      .sourceTagId(input.sourceTagId)
      .targetTagId(input.targetTagId);

    if (input.relationType) builder.relationType(input.relationType);
    if (input.weight !== undefined) builder.weight(input.weight);
    if (input.description) builder.description(input.description);

    const relation = builder.build();
    await database.tagRelations.add(relation);
    return relation;
  },

  /**
   * Update a relation
   */
  async update(id: string, updates: TagRelationUpdateInput): Promise<number> {
    return database.tagRelations.update(id, updates);
  },

  /**
   * Delete a relation
   */
  async delete(id: string): Promise<void> {
    await database.tagRelations.delete(id);
  },

  /**
   * Delete relation between two tags
   */
  async deleteBetween(sourceTagId: string, targetTagId: string): Promise<void> {
    await database.tagRelations
      .where("[sourceTagId+targetTagId]")
      .equals([sourceTagId, targetTagId])
      .delete();
  },

  /**
   * Get all relations in a workspace
   */
  async getByWorkspace(workspaceId: string): Promise<TagRelationInterface[]> {
    return database.tagRelations.where("workspace").equals(workspaceId).toArray();
  },

  /**
   * Get relations for a specific tag (as source or target)
   */
  async getByTagId(tagId: string): Promise<TagRelationInterface[]> {
    const asSource = await database.tagRelations.where("sourceTagId").equals(tagId).toArray();
    const asTarget = await database.tagRelations.where("targetTagId").equals(tagId).toArray();
    return [...asSource, ...asTarget];
  },

  /**
   * Get relation between two specific tags
   */
  async getBetween(sourceTagId: string, targetTagId: string): Promise<TagRelationInterface | undefined> {
    return database.tagRelations
      .where("[sourceTagId+targetTagId]")
      .equals([sourceTagId, targetTagId])
      .first();
  },
};

// ============================================
// Graph Data Helper
// ============================================

export interface TagGraphData {
  nodes: Array<{
    id: string;
    label: string;
    color: string;
    category: TagCategory;
    usageCount: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: RelationType;
    weight: number;
  }>;
}

/**
 * Get tag graph data for visualization
 */
export async function getTagGraph(workspaceId: string): Promise<TagGraphData> {
  const [tags, relations, nodeTags] = await Promise.all([
    database.tags.where("workspace").equals(workspaceId).toArray(),
    database.tagRelations.where("workspace").equals(workspaceId).toArray(),
    database.nodeTags.toArray(),
  ]);

  // Count usage for each tag
  const usageMap = new Map<string, number>();
  for (const nt of nodeTags) {
    usageMap.set(nt.tagId, (usageMap.get(nt.tagId) || 0) + 1);
  }

  return {
    nodes: tags.map((t) => ({
      id: t.id,
      label: t.name,
      color: t.color,
      category: t.category,
      usageCount: usageMap.get(t.id) || 0,
    })),
    edges: relations.map((r) => ({
      source: r.sourceTagId,
      target: r.targetTagId,
      type: r.relationType,
      weight: r.weight,
    })),
  };
}

/**
 * Get tags with their usage statistics
 */
export async function getTagsWithStats(workspaceId: string): Promise<Array<TagInterface & { usageCount: number }>> {
  const [tags, nodeTags] = await Promise.all([
    database.tags.where("workspace").equals(workspaceId).toArray(),
    database.nodeTags.toArray(),
  ]);

  const usageMap = new Map<string, number>();
  for (const nt of nodeTags) {
    usageMap.set(nt.tagId, (usageMap.get(nt.tagId) || 0) + 1);
  }

  return tags.map((t) => ({
    ...t,
    usageCount: usageMap.get(t.id) || 0,
  }));
}
