"use client";

import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * 优化后的文档布局组件
 * 合并多个功能，减少组件数量
 */
export function useOptimizedLayout() {
  const pathname = usePathname();

  // 合并多个 localStorage 读取
  const userPreferences = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        focusMode: false,
        sidebarCollapsed: false,
        fontSize: "lg" as const,
      };
    }

    return {
      focusMode: localStorage.getItem("docs-focus-mode") === "true",
      sidebarCollapsed: localStorage.getItem("docs-sidebar-collapsed") === "true",
      fontSize: (localStorage.getItem("docs-font-size") || "lg") as "sm" | "base" | "lg" | "xl",
    };
  }, []);

  // 合并滚动位置恢复
  const restoreScrollPosition = useCallback(() => {
    const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
    if (!mainContent) return;

    const savedPosition = sessionStorage.getItem(`docs-scroll-${pathname}`);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        mainContent.scrollTop = position;
      }, 100);
    }
  }, [pathname]);

  return {
    userPreferences,
    restoreScrollPosition,
  };
}

