/**
 * Novel Editor Database - Dexie Class Definition
 *
 * This file defines the Dexie database class with all tables and indexes.
 * Following the data-driven architecture, content is stored separately from nodes
 * for performance optimization with large documents (5000+ characters).
 *
 * Tables:
 * - nodes: File tree structure (without content)
 * - contents: Document content (Lexical JSON, Excalidraw, etc.)
 * - workspaces: Project/workspace metadata
 * - wikiEntries: Wiki knowledge base entries
 * - drawings: Excalidraw drawings
 * - users: User information and settings
 * - attachments: File attachments
 * - tags: Tag definitions
 * - nodeTags: Node-tag relationships
 * - tagRelations: Tag-tag relationships
 * - dbVersions: Database version tracking
 *
 * @requirements 5.1, 5.2
 */

import Dexie, { type Table } from "dexie";
import logger from "@/log/index.ts";

// Import interfaces from schema (will be migrated to models later)
import type {
	AttachmentInterface,
	DBVersionInterface,
	DrawingInterface,
	NodeInterface,
	ProjectInterface,
	UserInterface,
	WikiEntryInterface,
} from "./schema.ts";

// Import tag interfaces
import type { TagInterface, NodeTagInterface, TagRelationInterface } from "./models/tag";

/**
 * Content type for the contents table
 * Separating content from nodes enables lazy loading and better performance
 */
export type ContentType = "lexical" | "excalidraw" | "text";

/**
 * Content interface for the independent contents table
 * This allows loading node metadata without loading heavy content
 */
export interface ContentInterface {
	id: string;
	nodeId: string;
	content: string;
	contentType: ContentType;
	lastEdit: string;
}


/**
 * Novel Editor Database Class
 *
 * Extends Dexie to provide typed table access and version management.
 * Uses indexed queries for efficient data retrieval.
 */
export class NovelEditorDatabase extends Dexie {
	// Core tables
	nodes!: Table<NodeInterface, string>;
	contents!: Table<ContentInterface, string>;
	workspaces!: Table<ProjectInterface, string>;
	wikiEntries!: Table<WikiEntryInterface, string>;
	drawings!: Table<DrawingInterface, string>;
	users!: Table<UserInterface, string>;
	attachments!: Table<AttachmentInterface, string>;
	dbVersions!: Table<DBVersionInterface, string>;

	// Tag system tables
	tags!: Table<TagInterface, string>;
	nodeTags!: Table<NodeTagInterface, string>;
	tagRelations!: Table<TagRelationInterface, string>;

	constructor() {
		super("NovelEditorDB");

		// Version 7: Add contents table for content separation
		// Preserves backward compatibility with existing data
		this.version(7).stores({
			nodes: "id, workspace, parent, type, order",
			contents: "id, nodeId, contentType",
			workspaces: "id, title, owner",
			wikiEntries: "id, project, name",
			drawings: "id, project, name",
			users: "id, username, email",
			attachments: "id, project",
			dbVersions: "id, version",
			projects: "id, title, owner",
		});

		// Version 8: Add tag system tables
		this.version(8).stores({
			// Existing tables (unchanged)
			nodes: "id, workspace, parent, type, order",
			contents: "id, nodeId, contentType",
			workspaces: "id, title, owner",
			wikiEntries: "id, project, name",
			drawings: "id, project, name",
			users: "id, username, email",
			attachments: "id, project",
			dbVersions: "id, version",
			projects: "id, title, owner",

			// Tag definitions table
			// Indexes: id (primary), workspace, name, category
			tags: "id, workspace, name, category",

			// Node-tag junction table (many-to-many)
			// Indexes: id (primary), nodeId, tagId, compound [nodeId+tagId]
			nodeTags: "id, nodeId, tagId, [nodeId+tagId]",

			// Tag-tag relations table (for graph visualization)
			// Indexes: id (primary), workspace, sourceTagId, targetTagId, compound
			tagRelations: "id, workspace, sourceTagId, targetTagId, [sourceTagId+targetTagId]",
		});

		// Open database and log status
		this.open()
			.then(() => logger.success("NovelEditorDatabase initialized (v8)"))
			.catch((err) => logger.error("Database open error:", err));
	}
}

/**
 * Database singleton instance
 * Use this instance throughout the application for all database operations
 */
export const database = new NovelEditorDatabase();
