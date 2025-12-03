"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useScrollbar } from "./hooks/use-scrollbar";
import { DocNav } from "./doc-nav";
import { TableOfContents } from "./table-of-contents";
import { DocSearch } from "./doc-search";
import { Breadcrumb } from "./breadcrumb";
import { ReadingProgress } from "./reading-progress";
import { ScrollSmooth } from "./scroll-smooth";
import { KeyboardNavigation } from "./keyboard-navigation";
import { ScrollToTop } from "./scroll-to-top";
import { ScrollShadows } from "./scroll-shadows";
import { ReadingTime } from "./reading-time";
import { SidebarToggle } from "./sidebar-toggle";
import { KeyboardHelp } from "./keyboard-help";
import { FocusMode } from "./focus-mode";
import { CodeBlockCopy } from "./code-block-copy";
import { ScrollPosition } from "./scroll-position";
import { FontSizeControl } from "./font-size-control";
import { ChapterNavigation } from "./chapter-navigation";
import { ExternalLinks } from "./external-links";
import { ImageZoom } from "./image-zoom";
import { PrintStyles } from "./print-styles";
import { AccessibilityEnhancements } from "./accessibility-enhancements";
import { PerformanceMonitor } from "./performance-monitor";
import { KeyboardSearch } from "./keyboard-search";
import { MetadataDisplay } from "./metadata-display";
import { DocsErrorBoundary } from "./error-boundary";
import { ShareButton } from "./share-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  
  // 使用响应式 hook
  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    // 从 localStorage 读取专注模式状态
    const saved = localStorage.getItem("docs-focus-mode");
    if (saved === "true") {
      setFocusMode(true);
    }
  }, []);

  // 移动端切换时自动关闭侧边栏
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // 使用智能滚动条 Hook
  useScrollbar(mainContentRef);

  // 在文档页面隐藏全局 footer
  useEffect(() => {
    const footer = document.querySelector('body > footer') as HTMLElement;
    if (footer) {
      footer.style.display = 'none';
    }
    return () => {
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  return (
    <DocsErrorBoundary>
      <div className="relative min-h-screen bg-white dark:bg-black">
      {/* Keyboard Navigation */}
      <KeyboardNavigation />
      
      {/* Scroll Smooth Enhancement */}
      <ScrollSmooth />
      
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      {/* Scroll Shadows */}
      <ScrollShadows />
      
      {/* Scroll To Top Button */}
      <ScrollToTop />
      
      {/* Keyboard Help */}
      <KeyboardHelp />
      
      {/* Focus Mode */}
      <FocusMode onToggle={setFocusMode} />
      
      {/* Code Block Copy */}
      <CodeBlockCopy />
      
      {/* External Links */}
      <ExternalLinks />
      
      {/* Image Zoom */}
      <ImageZoom />
      
      {/* Scroll Position Memory */}
      <ScrollPosition />
      
      {/* Font Size Control */}
      <FontSizeControl />
      
      {/* Share Button */}
      <ShareButton />
      
      {/* Print Styles */}
      <PrintStyles />
      
      {/* Accessibility Enhancements */}
      <AccessibilityEnhancements />
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* Global Keyboard Search */}
      <KeyboardSearch />

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2"
        >
          {sidebarOpen ? (
            <>
              <X className="w-5 h-5" />
              <span>关闭导航</span>
            </>
          ) : (
            <>
              <Menu className="w-5 h-5" />
              <span>打开导航</span>
            </>
          )}
        </Button>
      </div>

      {/* Sidebar Toggle Button (Desktop) */}
      <div className="hidden lg:block">
        <SidebarToggle onToggle={setSidebarCollapsed} />
      </div>

      {/* Layout Container - 使用固定定位实现两侧固定、中间滚动 */}
      <div className="flex relative">
        {/* Left Sidebar - Navigation (固定定位) */}
        <aside
          className={cn(
            // 移动端：固定定位，可滑动
            "fixed lg:fixed inset-y-0 left-0 z-50",
            "bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800",
            "transform transition-all duration-300 ease-in-out",
            "top-20 lg:top-16",
            // 桌面端始终可见，移动端可切换
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            // 折叠状态
            (sidebarCollapsed || focusMode) && "lg:-translate-x-full",
            // 桌面端固定高度
            "lg:h-[calc(100vh-4rem)]"
          )}
        >
          <DocNav />
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </aside>

        {/* Main Content Area (中间区域，独立滚动) */}
        <main 
          ref={mainContentRef}
          className={cn(
            "flex-1 min-w-0",
            // 为左侧导航栏留出空间（折叠或专注模式时不需要）
            (sidebarCollapsed || focusMode) ? "lg:ml-0" : "lg:ml-64",
            // 为右侧目录留出空间（仅大屏幕）
            "xl:mr-64",
            // 固定高度，启用独立滚动
            "h-[calc(100vh-4rem)] overflow-y-auto",
            // 平滑滚动
            "scroll-smooth",
            // 智能滚动条：默认隐藏，悬停或滚动时显示
            "scrollbar-auto-hide",
            // 滚动性能优化
            "overscroll-contain"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Breadcrumb */}
            <Breadcrumb />
            
            {/* Metadata Display */}
            {pathname !== "/docs" && <MetadataDisplay />}
            
            {/* Reading Time */}
            {pathname !== "/docs" && <ReadingTime />}
            
            {/* Search (only on docs pages, not on /docs) */}
            {pathname !== "/docs" && (
              <div className="mb-6 lg:hidden">
                <DocSearch />
              </div>
            )}

            <article className="prose prose-lg prose-gray dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
              prose-headings:scroll-mt-20
              prose-p:text-gray-600 dark:prose-p:text-gray-300 
              prose-a:text-gray-900 dark:prose-a:text-white hover:prose-a:text-gray-700 dark:hover:prose-a:text-gray-200 
              prose-code:text-gray-900 dark:prose-code:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:text-gray-600 dark:prose-ul:text-gray-300
              prose-ol:text-gray-600 dark:prose-ol:text-gray-300
              prose-blockquote:border-l-gray-300 dark:prose-blockquote:border-l-gray-700
              prose-table:text-sm
              prose-th:border-gray-300 dark:prose-th:border-gray-700
              prose-td:border-gray-200 dark:prose-td:border-gray-800
              prose-hr:border-gray-200 dark:prose-hr:border-gray-800">
              {children}
            </article>
            
            {/* Chapter Navigation */}
            {pathname !== "/docs" && <ChapterNavigation />}
          </div>
        </main>

        {/* Right Sidebar - Table of Contents (固定定位) */}
        <aside 
          className={cn(
            "hidden xl:block",
            "fixed right-0 top-16",
            "h-[calc(100vh-4rem)]",
            "z-30",
            "transform transition-transform duration-300 ease-in-out",
            focusMode && "translate-x-full"
          )}
        >
          <TableOfContents />
        </aside>
      </div>
      </div>
    </DocsErrorBoundary>
  );
}

