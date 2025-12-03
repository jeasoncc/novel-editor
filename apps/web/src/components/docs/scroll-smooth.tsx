"use client";

import { useEffect } from "react";

export function ScrollSmooth() {
  useEffect(() => {
    // 处理锚点链接的平滑滚动
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href^='#']") as HTMLAnchorElement;
      
      if (link && link.hash) {
        e.preventDefault();
        const id = link.hash.slice(1);
        const element = document.getElementById(id);
        
        if (!element) return;

        // 查找内容滚动容器
        const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
        
        if (mainContent) {
          // 计算相对于滚动容器的位置
          const containerRect = mainContent.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const scrollTop = mainContent.scrollTop;
          const offset = 80; // Header height
          const offsetPosition = elementRect.top - containerRect.top + scrollTop - offset;

          mainContent.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        } else {
          // 回退到 window 滚动
          const offset = 80;
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        
        // 更新 URL 而不触发滚动
        window.history.pushState(null, "", link.hash);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
}

