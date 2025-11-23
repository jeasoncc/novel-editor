// 大纲页面路由
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/curd";
import { OutlineView } from "@/components/outline/outline-view";
import { useNavigate } from "@tanstack/react-router";
import type { ProjectInterface, ChapterInterface, SceneInterface } from "@/db/schema";

export const Route = createFileRoute("/outline")({
	component: OutlinePage,
});

function OutlinePage() {
	const navigate = useNavigate();
	
	// 获取所有数据
	const projects = useLiveQuery<ProjectInterface[]>(() => db.getAllProjects(), []) ?? [];
	const chapters = useLiveQuery<ChapterInterface[]>(() => db.getAllChapters(), []) ?? [];
	const scenes = useLiveQuery<SceneInterface[]>(() => db.getAllScenes(), []) ?? [];

	// 使用第一个项目作为默认项目
	const currentProject = projects[0];

	const handleNavigateToScene = (sceneId: string) => {
		// 导航到场景编辑页面
		const scene = scenes.find((s) => s.id === sceneId);
		if (scene) {
			navigate({
				to: "/projects/$projectId",
				params: { projectId: scene.project },
			});
			// 这里可以添加额外的逻辑来选中特定的场景
		}
	};

	if (!currentProject) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">暂无项目</h2>
					<p className="text-muted-foreground">请先创建一个项目</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen">
			<OutlineView
				project={currentProject}
				chapters={chapters.filter((ch) => ch.project === currentProject.id)}
				scenes={scenes.filter((sc) => sc.project === currentProject.id)}
				onNavigateToScene={handleNavigateToScene}
			/>
		</div>
	);
}
