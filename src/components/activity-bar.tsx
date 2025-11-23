import type * as React from "react";
import { useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/curd";
import { exportAll, importFromJson, readFileAsText, triggerDownload, createBook, exportAsMarkdown } from "@/services/projects";
import { openCreateBookDialog } from "@/components/blocks/createBookDialog";
import { BookMarked, Settings, ListTree, Users, BookOpen, Upload, Download, MoreHorizontal, Trash2, Plus, TrendingUp, FileJson, FileText } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm";
import { useSelectionStore } from "@/stores/selection";

export function ActivityBar(): React.ReactElement {
  const projects = useLiveQuery(() => db.getAllProjects(), []) || [];
  const selectedProjectId = useSelectionStore(s => s.selectedProjectId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const confirm = useConfirm();

  const handleExportBackup = useCallback(async () => {
    try {
      const json = await exportAll();
      triggerDownload(`novel-editor-backup-${new Date().toISOString().slice(0,10)}.json`, json);
      toast.success("备份导出成功");
    } catch {
      toast.error("导出失败");
    }
  }, []);

  const handleExportMarkdown = useCallback(async () => {
    if (!selectedProjectId) {
      if (projects.length > 0) {
        const pid = projects[0].id;
        const md = await exportAsMarkdown(pid);
        triggerDownload(`${projects[0].title}.md`, md, "text/markdown;charset=utf-8");
        toast.success("Markdown 导出成功");
      } else {
        toast.error("未找到可导出的项目");
      }
      return;
    }

    try {
      const project = projects.find(p => p.id === selectedProjectId);
      const md = await exportAsMarkdown(selectedProjectId);
      triggerDownload(`${project?.title || "novel"}.md`, md, "text/markdown;charset=utf-8");
      toast.success("Markdown 导出成功");
    } catch (e) {
      console.error(e);
      toast.error("导出失败");
    }
  }, [projects, selectedProjectId]);

  const handleQuickCreate = useCallback(async () => {
    const data = await openCreateBookDialog();
    if (!data) return;
    try {
      await createBook({ title: data.title, author: data.author, description: data.description ?? "" });
      toast.success(`已创建书籍：${data.title}`);
    } catch (e) {
      // createBook 内部有失败处理
    }
  }, []);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      await importFromJson(text, { keepIds: false });
      toast.success("导入成功");
    } catch {
      toast.error("导入失败");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleDeleteAllBooks = useCallback(async () => {
    const ok = await confirm({ title: "确认删除所有书籍？", description: "该操作不可恢复，将清空书籍、章节、场景与附件。", confirmText: "删除", cancelText: "取消" });
    if (!ok) return;
    try {
      await Promise.all([
        db.attachments.clear(),
        db.roles.clear(),
        db.scenes.clear(),
        db.chapters.clear(),
        db.projects.clear(),
      ]);
      toast.success("已删除所有书籍");
    } catch {
      toast.error("删除失败，请重试");
    }
  }, []);

  return (
    <aside className="flex h-screen w-12 shrink-0 flex-col items-center gap-2 border-r bg-card py-2 text-foreground">
      <TooltipProvider>
        {/* Books */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="书库" asChild>
              <Link to="/">
                <BookMarked className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">书库</TooltipContent>
        </Tooltip>

        {/* Outline */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="大纲" asChild>
              <Link to="/outline">
                <ListTree className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">大纲</TooltipContent>
        </Tooltip>

        {/* Characters */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="角色" asChild>
              <Link to="/characters">
                <Users className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">角色</TooltipContent>
        </Tooltip>

        {/* World */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="世界观" asChild>
              <Link to="/world">
                <BookOpen className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">世界观</TooltipContent>
        </Tooltip>

        <div className="my-1 h-px w-6 bg-border" />

        {/* Actions: Import / Export */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="新建书籍" onClick={handleQuickCreate}>
              <Plus className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">新建书籍</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="导入" onClick={handleImportClick}>
              <Upload className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">导入</TooltipContent>
        </Tooltip>

        <Popover>
            <Tooltip>
            <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label="导出" disabled={projects.length === 0}>
                        <Download className="size-5" />
                    </Button>
                </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">导出</TooltipContent>
            </Tooltip>
            <PopoverContent side="right" align="start" className="w-56 p-1">
                <div className="grid gap-1">
                    <button onClick={handleExportBackup} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full text-left">
                        <FileJson className="size-4" /> 导出备份 (JSON)
                    </button>
                    <button onClick={handleExportMarkdown} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full text-left">
                        <FileText className="size-4" /> 导出文档 (Markdown)
                    </button>
                </div>
            </PopoverContent>
        </Popover>

        {/* Statistics */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="统计" asChild>
              <Link to="/statistics">
                <TrendingUp className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">统计</TooltipContent>
        </Tooltip>

        {/* More (danger) */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="更多" disabled={projects.length === 0}>
                  <MoreHorizontal className="size-5" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">更多</TooltipContent>
          </Tooltip>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="flex flex-col gap-2">
              <Button variant="destructive" className="justify-start" onClick={handleDeleteAllBooks}>
                <Trash2 className="mr-2 size-4" /> 删除所有书籍
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="设置" asChild>
              <Link to="/settings/design">
                <Settings className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">设置</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </aside>
  );
}
