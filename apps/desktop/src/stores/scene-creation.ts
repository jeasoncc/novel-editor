import { create } from "zustand";

export interface SceneCreationState {
	// Track creation state per chapter
	creationStates: Record<
		string,
		{
			isCreating: boolean;
			lastCreatedSceneId: string | null;
			creationCount: number;
			lastOperationTimestamp: Date | null;
		}
	>;

	// Actions
	setCreating: (chapterId: string, isCreating: boolean) => void;
	setLastCreatedScene: (chapterId: string, sceneId: string) => void;
	incrementCreationCount: (chapterId: string) => void;
	resetCreationState: (chapterId: string) => void;
	canCreateScene: (chapterId: string) => boolean;
	getCreationState: (chapterId: string) => {
		isCreating: boolean;
		lastCreatedSceneId: string | null;
		creationCount: number;
		lastOperationTimestamp: Date | null;
	};
}

const getDefaultChapterState = () => ({
	isCreating: false,
	lastCreatedSceneId: null,
	creationCount: 0,
	lastOperationTimestamp: null,
});

export const useSceneCreationStore = create<SceneCreationState>((set, get) => ({
	creationStates: {},

	setCreating: (chapterId: string, isCreating: boolean) => {
		set((state) => ({
			creationStates: {
				...state.creationStates,
				[chapterId]: {
					...getDefaultChapterState(),
					...state.creationStates[chapterId],
					isCreating,
					lastOperationTimestamp: new Date(),
				},
			},
		}));
	},

	setLastCreatedScene: (chapterId: string, sceneId: string) => {
		set((state) => ({
			creationStates: {
				...state.creationStates,
				[chapterId]: {
					...getDefaultChapterState(),
					...state.creationStates[chapterId],
					lastCreatedSceneId: sceneId,
					lastOperationTimestamp: new Date(),
				},
			},
		}));
	},

	incrementCreationCount: (chapterId: string) => {
		set((state) => ({
			creationStates: {
				...state.creationStates,
				[chapterId]: {
					...getDefaultChapterState(),
					...state.creationStates[chapterId],
					creationCount:
						(state.creationStates[chapterId]?.creationCount || 0) + 1,
					lastOperationTimestamp: new Date(),
				},
			},
		}));
	},

	resetCreationState: (chapterId: string) => {
		set((state) => ({
			creationStates: {
				...state.creationStates,
				[chapterId]: getDefaultChapterState(),
			},
		}));
	},

	canCreateScene: (chapterId: string) => {
		const state = get();
		const chapterState = state.creationStates[chapterId];
		return !chapterState?.isCreating;
	},

	getCreationState: (chapterId: string) => {
		const state = get();
		return state.creationStates[chapterId] || getDefaultChapterState();
	},
}));

// Helper hooks for reactive access to specific chapter states
export const useCanCreateScene = (chapterId: string) => {
	return useSceneCreationStore((state) => {
		const chapterState = state.creationStates[chapterId];
		return !chapterState?.isCreating;
	});
};

export const useCreationState = (chapterId: string) => {
	return useSceneCreationStore((state) => {
		return state.creationStates[chapterId] || getDefaultChapterState();
	});
};
