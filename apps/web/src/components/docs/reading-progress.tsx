"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        // 查找内容滚动容器
        const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
        
        if (mainContent) {
          // 基于内容区域的滚动计算
          const scrollTop = mainContent.scrollTop;
          const scrollHeight = mainContent.scrollHeight;
          const clientHeight = mainContent.clientHeight;
          const totalScrollableHeight = scrollHeight - clientHeight;
          
          const scrollProgress = totalScrollableHeight > 0
            ? (scrollTop / totalScrollableHeight) * 100
            : 0;
          
          setProgress(Math.min(100, Math.max(0, scrollProgress)));
        } else {
          // 回退到 window 滚动
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;
          
          const totalScrollableHeight = documentHeight - windowHeight;
          const scrollProgress = totalScrollableHeight > 0
            ? (scrollTop / totalScrollableHeight) * 100
            : 0;
          
          setProgress(Math.min(100, Math.max(0, scrollProgress)));
        }
      });
    };

    // 监听内容区域的滚动
    const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
    const scrollTarget = mainContent || window;
    
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始执行

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-gray-200/50 dark:bg-gray-800/50 z-50">
      <div
        className="h-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

