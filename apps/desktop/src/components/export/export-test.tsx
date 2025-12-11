/**
 * 导出功能测试组件
 * Export Functionality Test Component
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "./export-button";
import { exportDialogManager } from "./export-dialog-manager";
import { useEnhancedExport } from "@/hooks/use-enhanced-export";
import { detectEnvironment } from "@/services/export-enhanced";

export function ExportTest() {
	const { 
		isExporting, 
		exportProgress, 
		lastResult, 
		quickExport,
		environment,
		isTauri,
		supportsFileDialog,
		supportsDirectSave 
	} = useEnhancedExport();

	const testProjectId = "test-project-id";
	const testProjectTitle = "测试项目";

	const handleQuickExport = async () => {
		await quickExport(testProjectId, "txt", testProjectTitle);
	};

	const handleOpenDialog = () => {
		exportDialogManager.open(testProjectId, testProjectTitle);
	};

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						增强导出功能测试
						<Badge variant="outline">
							{environment === "tauri" ? "Tauri 环境" : "浏览器环境"}
						</Badge>
					</CardTitle>
					<CardDescription>
						测试增强的导出功能，支持 Tauri 和浏览器环境
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* 环境信息 */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<strong>运行环境:</strong> {environment}
						</div>
						<div>
							<strong>Tauri 支持:</strong> {isTauri ? "是" : "否"}
						</div>
						<div>
							<strong>文件对话框:</strong> {supportsFileDialog ? "支持" : "不支持"}
						</div>
						<div>
							<strong>直接保存:</strong> {supportsDirectSave ? "支持" : "不支持"}
						</div>
					</div>

					{/* 导出状态 */}
					{isExporting && (
						<div className="p-4 bg-blue-50 rounded-lg">
							<div className="text-sm font-medium">正在导出... ({exportProgress}%)</div>
							<div className="w-full bg-blue-200 rounded-full h-2 mt-2">
								<div 
									className="bg-blue-600 h-2 rounded-full transition-all duration-300"
									style={{ width: `${exportProgress}%` }}
								/>
							</div>
						</div>
					)}

					{/* 最后结果 */}
					{lastResult && (
						<div className={`p-4 rounded-lg ${
							lastResult.success 
								? "bg-green-50 text-green-800" 
								: "bg-red-50 text-red-800"
						}`}>
							<div className="font-medium">
								{lastResult.success ? "导出成功" : "导出失败"}
							</div>
							{lastResult.filePath && (
								<div className="text-sm mt-1">
									文件: {lastResult.filePath}
								</div>
							)}
							{lastResult.error && (
								<div className="text-sm mt-1">
									错误: {lastResult.error}
								</div>
							)}
						</div>
					)}

					{/* 测试按钮 */}
					<div className="flex flex-wrap gap-3">
						<Button 
							onClick={handleQuickExport}
							disabled={isExporting}
						>
							快速导出 (TXT)
						</Button>
						
						<Button 
							variant="outline"
							onClick={handleOpenDialog}
							disabled={isExporting}
						>
							打开导出对话框
						</Button>

						<ExportButton
							projectId={testProjectId}
							projectTitle={testProjectTitle}
							variant="outline"
							showQuickExport={true}
						/>

						<ExportButton
							projectId={testProjectId}
							projectTitle={testProjectTitle}
							variant="ghost"
							showQuickExport={false}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}