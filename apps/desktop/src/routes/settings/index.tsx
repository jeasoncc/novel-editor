import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/settings/")({
	component: SettingsIndex,
});

function SettingsIndex() {
	return (
		<div className="container max-w-4xl py-6">
			<div className="space-y-6">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<Settings className="size-16 text-muted-foreground" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">设置</h1>
						<p className="text-muted-foreground mt-2">
							选择左侧的选项来配置应用程序
						</p>
					</div>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
					<div className="p-4 border rounded-lg">
						<h3 className="font-semibold mb-2">外观设置</h3>
						<p className="text-sm text-muted-foreground">
							自定义主题、颜色和视觉效果
						</p>
					</div>
					<div className="p-4 border rounded-lg">
						<h3 className="font-semibold mb-2">编辑器设置</h3>
						<p className="text-sm text-muted-foreground">
							配置编辑器行为和快捷键
						</p>
					</div>
					<div className="p-4 border rounded-lg">
						<h3 className="font-semibold mb-2">数据管理</h3>
						<p className="text-sm text-muted-foreground">
							备份、恢复和清空数据
						</p>
					</div>
					<div className="p-4 border rounded-lg">
						<h3 className="font-semibold mb-2">通用设置</h3>
						<p className="text-sm text-muted-foreground">
							语言、自动保存等基本设置
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}