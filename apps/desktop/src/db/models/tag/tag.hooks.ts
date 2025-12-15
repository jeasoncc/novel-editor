/**
 * Tag React Hooks
 *
 * Provides React hooks for accessing tag data with live updates.
 *
 * @requirements 3.3
 */

import { useLiveQuery } from "dexie-react-hooks";
import { database } from "../../database";
import type { TagInterface, TagCategory } from "./tag.interface";
import type { NodeTagInterface } from "./node-tag.interface";
import type { TagRelationInterface } from "./tag-relation.interface";
import { getTagGraph, getTagsWithStats, type TagGraphData } from "./tag.repository";

/**
 * Hook to get all tags in a workspace
 */
export function useTagsByWorkspace(
  workspaceId: string | null | undefined
): TagInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId) return [];
      return database.tags.where("workspace").equals(workspaceId).toArray();
    },
    [workspaceId],
    undefined
  );
}

/**
 * Hook to get a single tag by ID
 */
export function useTag(tagId: string | null | undefined): TagInterface | undefined {
  return useLiveQuery(
    async () => {
      if (!tagId) return undefined;
      return database.tags.get(tagId);
    },
    [tagId],
    undefined
  );
}

/**
 * Hook to get tags by category
 */
export function useTagsByCategory(
  workspaceId: string | null | undefined,
  category: TagCategory
): TagInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId) return [];
      return database.tags
        .where("workspace")
        .equals(workspaceId)
        .and((t) => t.category === category)
        .toArray();
    },
    [workspaceId, category],
    undefined
  );
}

/**
 * Hook to get all tags for a node
 */
export function useNodeTags(nodeId: string | null | undefined): TagInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!nodeId) return [];
      const nodeTags = await database.nodeTags.where("nodeId").equals(nodeId).toArray();
      const tagIds = nodeTags.map((nt) => nt.tagId);
      if (tagIds.length === 0) return [];
      return database.tags.where("id").anyOf(tagIds).toArray();
    },
    [nodeId],
    undefined
  );
}

/**
 * Hook to get node-tag relations for a node
 */
export function useNodeTagRelations(nodeId: string | null | undefined): NodeTagInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!nodeId) return [];
      return database.nodeTags.where("nodeId").equals(nodeId).toArray();
    },
    [nodeId],
    undefined
  );
}

/**
 * Hook to get all nodes that have a specific tag
 */
export function useNodesWithTag(tagId: string | null | undefined): string[] | undefined {
  return useLiveQuery(
    async () => {
      if (!tagId) return [];
      const nodeTags = await database.nodeTags.where("tagId").equals(tagId).toArray();
      return nodeTags.map((nt) => nt.nodeId);
    },
    [tagId],
    undefined
  );
}

/**
 * Hook to get tag relations in a workspace
 */
export function useTagRelations(
  workspaceId: string | null | undefined
): TagRelationInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId) return [];
      return database.tagRelations.where("workspace").equals(workspaceId).toArray();
    },
    [workspaceId],
    undefined
  );
}

/**
 * Hook to get relations for a specific tag
 */
export function useTagRelationsForTag(tagId: string | null | undefined): TagRelationInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!tagId) return [];
      const asSource = await database.tagRelations.where("sourceTagId").equals(tagId).toArray();
      const asTarget = await database.tagRelations.where("targetTagId").equals(tagId).toArray();
      return [...asSource, ...asTarget];
    },
    [tagId],
    undefined
  );
}

/**
 * Hook to get tag graph data for visualization
 */
export function useTagGraph(workspaceId: string | null | undefined): TagGraphData | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId) return { nodes: [], edges: [] };
      return getTagGraph(workspaceId);
    },
    [workspaceId],
    undefined
  );
}

/**
 * Hook to get tags with usage statistics
 */
export function useTagsWithStats(
  workspaceId: string | null | undefined
): Array<TagInterface & { usageCount: number }> | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId) return [];
      return getTagsWithStats(workspaceId);
    },
    [workspaceId],
    undefined
  );
}

/**
 * Hook to search tags by name
 */
export function useTagSearch(
  workspaceId: string | null | undefined,
  query: string
): TagInterface[] | undefined {
  return useLiveQuery(
    async () => {
      if (!workspaceId || !query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return database.tags
        .where("workspace")
        .equals(workspaceId)
        .and((t) => t.name.toLowerCase().includes(lowerQuery))
        .toArray();
    },
    [workspaceId, query],
    undefined
  );
}

/**
 * Hook to count tag usage
 */
export function useTagUsageCount(tagId: string | null | undefined): number | undefined {
  return useLiveQuery(
    async () => {
      if (!tagId) return 0;
      return database.nodeTags.where("tagId").equals(tagId).count();
    },
    [tagId],
    undefined
  );
}
