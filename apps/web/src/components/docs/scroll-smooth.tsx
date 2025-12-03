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
        // 验证 hash 是否有效（只包含安全的字符）
        if (link.hash && /^#[a-zA-Z0-9_-]+$/.test(link.hash)) {
          // 检查是否在安全的环境中（HTTPS 或 localhost）
          const isSecureContext = window.isSecureContext || 
            window.location.protocol === 'https:' || 
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
          
          if (isSecureContext) {
            try {
              // 使用 try-catch 包装，防止安全错误
              window.history.pushState(null, "", link.hash);
            } catch (error) {
              // 静默处理错误，不影响用户体验
              // 某些浏览器环境可能不支持此操作
            }
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
}

