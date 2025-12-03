/**
 * PlantUML 图表查看器组件
 */

import { useState, useEffect } from "react";
import { Download, Copy, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getPlantUMLImageUrl } from "@/lib/plantuml-generator";
import { cn } from "@/lib/utils";

interface PlantUMLViewerProps {
	code: string;
	title?: string;
	className?: string;
}

export function PlantUMLViewer({ code, title, className }: PlantUMLViewerProps) {
	const [imageUrl, setImageUrl] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (code) {
			setLoading(true);
			setError(false);
			try {
				const url = getPlantUMLImageUrl(code, "svg");
				setImageUrl(url);
			} catch (err) {
				setError(true);
				toast.error("生成图表失败");
			}
		}
	}, [code]);

	const handleImageLoad = () => {
		setLoading(false);
	};

	const handleImageError = () => {
		setLoading(false);
		setError(true);
	};

	const handleCopyCode = () => {
		navigator.clipboard.writeText(code);
		toast.success("PlantUML 代码已复制");
	};

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = `${title || "diagram"}.svg`;
		link.click();
		toast.success("图表已下载");
	};

	const handleRefresh = () => {
		setLoading(true);
		setError(false);
		const url = getPlantUMLImageUrl(code, "svg");
		setImageUrl(url + "?t=" + Date.now()); // 添加时间戳强制刷新
	};

	if (!code) {
		return (
			<div className="flex items-center justify-center h-64 text-muted-foreground">
				<p>暂无图表数据</p>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col", className)}>
			{/* 工具栏 */}
			<div className="flex items-center justify-between p-2 border-b bg-muted/30">
				{title && <span className="text-sm font-medium">{title}</span>}
				<div className="flex items-center gap-1">
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={handleRefresh}
						title="刷新"
					>
						<RefreshCw className="size-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={handleCopyCode}
						title="复制代码"
					>
						<Copy className="size-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={handleDownload}
						title="下载图表"
					>
						<Download className="size-4" />
					</Button>
				</div>
			</div>

			{/* 图表显示区域 */}
			<div className="flex-1 relative bg-white dark:bg-gray-900 overflow-auto">
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="size-8 animate-spin text-muted-foreground" />
					</div>
				)}

				{error && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
						<p className="text-destructive">图表加载失败</p>
						<Button size="sm" variant="outline" onClick={handleRefresh}>
							重试
						</Button>
					</div>
				)}

				{imageUrl && (
					<div className="p-4 flex items-center justify-center min-h-[400px]">
						<img
							src={imageUrl}
							alt={title || "PlantUML Diagram"}
							onLoad={handleImageLoad}
							onError={handleImageError}
							className={cn(
								"max-w-full h-auto",
								loading && "opacity-0"
							)}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
