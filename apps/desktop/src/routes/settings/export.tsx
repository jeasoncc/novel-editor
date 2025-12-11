/**
 * 导出设置页面
 * Export Settings Page
 * 
 * Requirements: 5.1, 5.2, 5.5
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FolderOpen, Trash2, Download, AlertCircle } from "lucide-react";
import {
  getDefaultExportPath,
  setDefaultExportPath,
  selectExportDirectory,
  getDownloadsDirectory,
  isTauriEnvironment,
} from "@/services/export-path";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/export")({
  component: ExportSettingsPage,
});

function ExportSettingsPage() {
  const [defaultPath, setDefaultPathState] = useState<string | null>(null);
  const [downloadsDir, setDownloadsDir] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTauri, setIsTauri] = useState(false);

  // 加载初始设置
  useEffect(() => {
    setIsTauri(isTauriEnvironment());
    setDefaultPathState(getDefaultExportPath());
    
    // 获取系统下载目录
    getDownloadsDirectory().then((dir) => {
      setDownloadsDir(dir);
    });
  }, []);

  // 选择导出路径
  // Uses current default path as initial directory (Requirements 5.4)
  const handleSelectPath = async () => {
    if (!isTauri) {
      toast.error("此功能仅在桌面应用中可用");
      return;
    }

    setIsLoading(true);
    try {
      // Use current default path or downloads directory as initial directory
      const initialDir = defaultPath || downloadsDir || null;
      const selectedPath = await selectExportDirectory(initialDir);
      if (selectedPath) {
        setDefaultExportPath(selectedPath);
        setDefaultPathState(selectedPath);
        toast.success("默认导出路径已设置");
      }
    } catch (error) {
      toast.error(`选择路径失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 清除默认路径
  const handleClearPath = () => {
    setDefaultExportPath(null);
    setDefaultPathState(null);
    toast.success("默认导出路径已清除，将使用系统下载目录");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">导出设置</h3>
        <p className="text-sm text-muted-foreground">
          配置文件导出的默认路径和相关选项
        </p>
      </div>
      <Separator />

      <div className="grid gap-8">
        {/* 环境提示 */}
        {!isTauri && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-500">浏览器环境</p>
              <p className="text-sm text-muted-foreground">
                自定义导出路径功能仅在桌面应用中可用。在浏览器中，文件将自动下载到默认下载目录。
              </p>
            </div>
          </div>
        )}

        {/* 默认导出路径 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-base">默认导出路径</Label>
              <p className="text-sm text-muted-foreground">
                设置导出文件时的默认保存目录。如果未设置，将使用系统下载目录。
              </p>
            </div>
          </div>

          {/* 当前路径显示 */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <FolderOpen className="size-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              {defaultPath ? (
                <p className="text-sm font-mono truncate" title={defaultPath}>
                  {defaultPath}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {downloadsDir ? (
                    <span className="font-mono">{downloadsDir}</span>
                  ) : (
                    "系统下载目录（默认）"
                  )}
                </p>
              )}
            </div>
            {defaultPath && (
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                自定义
              </span>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSelectPath}
              disabled={isLoading || !isTauri}
            >
              <FolderOpen className="size-4" />
              选择路径
            </Button>
            {defaultPath && (
              <Button
                variant="ghost"
                onClick={handleClearPath}
                disabled={isLoading}
              >
                <Trash2 className="size-4" />
                清除设置
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* 系统下载目录信息 */}
        <div className="space-y-4">
          <div className="space-y-0.5">
            <Label className="text-base">系统下载目录</Label>
            <p className="text-sm text-muted-foreground">
              当未设置默认导出路径时，文件将保存到此目录。
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-dashed">
            <Download className="size-5 text-muted-foreground shrink-0" />
            <p className="text-sm font-mono text-muted-foreground truncate">
              {downloadsDir || "无法获取系统下载目录"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
