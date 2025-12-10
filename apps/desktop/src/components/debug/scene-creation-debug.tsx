import { useSceneCreationStore } from "@/stores/scene-creation";

interface SceneCreationDebugProps {
	chapterId: string;
}

export function SceneCreationDebug({ chapterId }: SceneCreationDebugProps) {
	const creationState = useSceneCreationStore(
		(state) =>
			state.creationStates[chapterId] || {
				isCreating: false,
				lastCreatedSceneId: null,
				creationCount: 0,
				lastOperationTimestamp: null,
			},
	);

	return (
		<div className="p-2 bg-gray-100 rounded text-xs">
			<div>
				<strong>Chapter:</strong> {chapterId}
			</div>
			<div>
				<strong>Is Creating:</strong> {creationState.isCreating ? "Yes" : "No"}
			</div>
			<div>
				<strong>Can Create:</strong> {!creationState.isCreating ? "Yes" : "No"}
			</div>
			<div>
				<strong>Creation Count:</strong> {creationState.creationCount}
			</div>
			<div>
				<strong>Last Created:</strong>{" "}
				{creationState.lastCreatedSceneId || "None"}
			</div>
			<div>
				<strong>Last Operation:</strong>{" "}
				{creationState.lastOperationTimestamp?.toLocaleTimeString() || "None"}
			</div>
		</div>
	);
}
