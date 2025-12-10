import { db } from "@/db/curd";
import type { SceneInterface } from "@/db/schema";
import { useSceneCreationStore } from "@/stores/scene-creation";

export interface SceneCreationParams {
	projectId: string;
	chapterId: string;
	title: string;
	order: number;
	content?: string;
	type?: "text" | "canvas";
}

export interface SceneCreationResult {
	success: boolean;
	scene?: SceneInterface;
	error?: string;
}

export class SceneCreationService {
	private static instance: SceneCreationService;

	static getInstance(): SceneCreationService {
		if (!SceneCreationService.instance) {
			SceneCreationService.instance = new SceneCreationService();
		}
		return SceneCreationService.instance;
	}

	async createScene(params: SceneCreationParams): Promise<SceneCreationResult> {
		const { chapterId } = params;
		const store = useSceneCreationStore.getState();

		// Check if creation is already in progress
		if (!store.canCreateScene(chapterId)) {
			return {
				success: false,
				error: "Scene creation already in progress for this chapter",
			};
		}

		// Set creation state
		store.setCreating(chapterId, true);

		try {
			// Validate parameters
			if (!params.projectId || !params.chapterId || !params.title) {
				throw new Error("Missing required parameters for scene creation");
			}

			// Create the scene
			const newScene = await db.addScene({
				project: params.projectId,
				chapter: params.chapterId,
				title: params.title,
				order: params.order,
				content: params.content ?? "",
				type: params.type ?? "text",
			});

			// Update creation state
			store.setLastCreatedScene(chapterId, newScene.id);
			store.incrementCreationCount(chapterId);

			return {
				success: true,
				scene: newScene,
			};
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		} finally {
			// Always reset creation state
			store.setCreating(chapterId, false);
		}
	}

	async createCanvasScene(
		params: Omit<SceneCreationParams, "type">,
	): Promise<SceneCreationResult> {
		const { chapterId, projectId } = params;

		// Generate file path for canvas scene
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const filePath = `canvas/${projectId}/${timestamp}.excalidraw`;

		const canvasParams: SceneCreationParams = {
			...params,
			type: "canvas",
			content: JSON.stringify({ elements: [], appState: {}, files: {} }),
		};

		const result = await this.createScene(canvasParams);

		if (result.success && result.scene) {
			// Update the scene with the file path
			await db.updateScene(result.scene.id, { filePath });
			result.scene.filePath = filePath;
		}

		return result;
	}

	resetCreationState(chapterId: string): void {
		const store = useSceneCreationStore.getState();
		store.resetCreationState(chapterId);
	}

	getCreationState(chapterId: string) {
		const store = useSceneCreationStore.getState();
		return store.getCreationState(chapterId);
	}

	canCreateScene(chapterId: string): boolean {
		const store = useSceneCreationStore.getState();
		return store.canCreateScene(chapterId);
	}
}

// Export singleton instance
export const sceneCreationService = SceneCreationService.getInstance();
