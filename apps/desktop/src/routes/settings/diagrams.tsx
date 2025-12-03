import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagramSettings } from "@/lib/diagram-settings";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/settings/diagrams")({
	component: DiagramSettings,
});

function DiagramSettings() {
	const {
		krokiServerUrl,
		enableKroki,
		setKrokiServerUrl,
		setEnableKroki,
		testKrokiConnection,
	} = useDiagramSettings();

	const [testUrl, setTestUrl] = useState(krokiServerUrl);
	const [testing, setTesting] = useState(false);
	const [testResult, setTestResult] = useState<boolean | null>(null);

	const handleTest = async () => {
		if (!testUrl.trim()) {
			toast.error("请输入 Kroki 服务器地址");
			return;
		}

		setTesting(true);
		setTestResult(null);

		// 临时设置 URL 进行测试
		const originalUrl = krokiServerUrl;
		setKrokiServerUrl(testUrl);

		const success = await testKrokiConnection();
		setTestResult(success);

		if (success) {
			toast.success("连接成功！");
		} else {
			toast.error("连接失败，请检查服务器地址");
			// 恢复原来的 URL
			setKrokiServerUrl(originalUrl);
			setTestUrl(originalUrl);
		}

		setTesting(false);
	};

	const handleSave = () => {
		setKrokiServerUrl(testUrl);
		toast.success("设置已保存");
	};

	const handleEnableToggle = (checked: boolean) => {
		if (checked && !krokiServerUrl) {
			toast.error("请先配置 Kroki 服务器地址");
			return;
		}
		setEnableKroki(checked);
		toast.success(checked ? "已启用 PlantUML 支持" : "已禁用 PlantUML 支持");
	};

	return (
		<div className="container max-w-4xl py-8 space-y-6">
			<div>
				<h1 className="text-3xl font-bold">图表设置</h1>
				<p className="text-muted-foreground mt-2">
					配置图表渲染服务，支持 Mermaid 和 PlantUML
				</p>
			</div>

			{/* Mermaid 说明 */}
			<Card>
				<CardHeader>
					<CardTitle>Mermaid 图表</CardTitle>
					<CardDescription>
						纯前端渲染，无需配置，默认启用
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<CheckCircle2 className="h-4 w-4 text-green-500" />
						<span>Mermaid 已启用，支持流程图、时间线、甘特图等</span>
					</div>
				</CardContent>
			</Card>

			{/* Kroki/PlantUML 配置 */}
			<Card>
				<CardHeader>
					<CardTitle>PlantUML 图表（可选）</CardTitle>
					<CardDescription>
						通过 Kroki 服务器渲染 PlantUML 图表，功能更强大
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* 启用开关 */}
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>启用 PlantUML 支持</Label>
							<p className="text-sm text-muted-foreground">
								需要配置 Kroki 服务器
							</p>
						</div>
						<Switch
							checked={enableKroki}
							onCheckedChange={handleEnableToggle}
						/>
					</div>

					{/* 服务器地址配置 */}
					<div className="space-y-2">
						<Label htmlFor="kroki-url">Kroki 服务器地址</Label>
						<div className="flex gap-2">
							<Input
								id="kroki-url"
								type="url"
								placeholder="https://kroki.io"
								value={testUrl}
								onChange={(e) => {
									setTestUrl(e.target.value);
									setTestResult(null);
								}}
							/>
							<Button
								variant="outline"
								onClick={handleTest}
								disabled={testing || !testUrl.trim()}
							>
								{testing ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										测试中
									</>
								) : (
									"测试连接"
								)}
							</Button>
						</div>
						
						{/* 测试结果 */}
						{testResult !== null && (
							<div className="flex items-center gap-2 text-sm">
								{testResult ? (
									<>
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										<span className="text-green-600">连接成功</span>
									</>
								) : (
									<>
										<XCircle className="h-4 w-4 text-red-500" />
										<span className="text-red-600">连接失败</span>
									</>
								)}
							</div>
						)}

						<p className="text-xs text-muted-foreground">
							推荐使用官方服务：https://kroki.io 或自建 Kroki 服务器
						</p>
					</div>

					{/* 保存按钮 */}
					<div className="flex gap-2">
						<Button
							onClick={handleSave}
							disabled={testUrl === krokiServerUrl}
						>
							保存设置
						</Button>
						<Button
							variant="outline"
							onClick={() => setTestUrl(krokiServerUrl)}
							disabled={testUrl === krokiServerUrl}
						>
							重置
						</Button>
					</div>

					{/* 帮助信息 */}
					<div className="border-t pt-4 space-y-2">
						<h4 className="text-sm font-medium">关于 Kroki</h4>
						<p className="text-sm text-muted-foreground">
							Kroki 是一个开源的图表渲染服务，支持 PlantUML、Mermaid 等多种图表格式。
						</p>
						<div className="flex gap-4 text-sm">
							<a
								href="https://kroki.io"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline flex items-center gap-1"
							>
								官方服务
								<ExternalLink className="h-3 w-3" />
							</a>
							<a
								href="https://docs.kroki.io/kroki/setup/install/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline flex items-center gap-1"
							>
								自建指南
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 使用说明 */}
			<Card>
				<CardHeader>
					<CardTitle>使用说明</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<p>• Mermaid 图表默认启用，无需配置，完全离线可用</p>
					<p>• PlantUML 需要配置 Kroki 服务器，功能更强大但需要网络连接</p>
					<p>• 启用 PlantUML 后，大纲视图会显示额外的 PlantUML 图表选项卡</p>
					<p>• 可以使用官方 Kroki 服务（https://kroki.io）或自建服务器</p>
				</CardContent>
			</Card>
		</div>
	);
}
