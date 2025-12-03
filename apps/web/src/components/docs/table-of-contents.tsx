"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollbar } from "./hooks/use-scrollbar";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headingsRef = useRef<Heading[]>([]);

  useEffect(() => {
    // 提取页面中的所有标题
    const extractHeadings = () => {
      const elements = document.querySelectorAll("article h2, article h3, article h4");
      const headingsList: Heading[] = [];

      elements.forEach((element) => {
        let id = element.id;
        if (!id && element.textContent) {
          // 从文本内容生成安全的 URL 兼容 ID
          const text = element.textContent.trim();
          const index = Array.from(elements).indexOf(element);
          
          // 生成一个安全的 ID（只包含字母、数字、连字符和下划线）
          // 对于包含中文的标题，使用索引作为备用
          id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .substring(0, 50); // 限制长度
          
          // 如果 ID 包含非 ASCII 字符或为空，使用索引
          if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
            id = `heading-${index}`;
          }
          
          element.id = id;
        }
        
        if (id && element.textContent) {
          headingsList.push({
            id,
            text: element.textContent.trim(),
            level: parseInt(element.tagName.charAt(1)),
          });
        }
      });

      headingsRef.current = headingsList;
      setHeadings(headingsList);
      
      // 如果 URL 有 hash，滚动到对应位置
      if (window.location.hash) {
        const hashId = window.location.hash.slice(1);
        const element = document.getElementById(hashId);
        if (element) {
          setTimeout(() => {
            const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
            if (mainContent) {
              const containerRect = mainContent.getBoundingClientRect();
              const elementRect = element.getBoundingClientRect();
              const scrollTop = mainContent.scrollTop;
              const offsetTop = elementRect.top - containerRect.top + scrollTop - 80;
              
              mainContent.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: "smooth",
              });
            }
            setActiveId(hashId);
          }, 100);
        }
      }
    };

    // 延迟提取，等待 DOM 渲染完成
    const timer = setTimeout(extractHeadings, 300);
    
    // 监听 DOM 更新（节流）
    let observerTimer: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(observerTimer);
      observerTimer = setTimeout(extractHeadings, 500);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 监听滚动，高亮当前章节（节流）
    const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
    if (!mainContent) {
      return () => {
        clearTimeout(timer);
        clearTimeout(observerTimer);
        observer.disconnect();
      };
    }

    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const headings = headingsRef.current;
        if (headings.length === 0) return;
        
        const scrollTop = mainContent.scrollTop;
        const scrollPosition = scrollTop + 150;

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          const element = document.getElementById(heading.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const containerRect = mainContent.getBoundingClientRect();
            const offsetTop = rect.top - containerRect.top + scrollTop;
            
            if (scrollPosition >= offsetTop) {
              setActiveId(heading.id);
              // 只在 ID 有效且当前 hash 不同时才更新
              if (heading.id && /^[a-zA-Z0-9_-]+$/.test(heading.id)) {
                const newHash = `#${heading.id}`;
                if (window.location.hash !== newHash) {
                  // 检查是否在安全的环境中（HTTPS 或 localhost）
                  const isSecureContext = window.isSecureContext || 
                    window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';
                  
                  if (isSecureContext) {
                    try {
                      // 使用 try-catch 包装，防止安全错误
                      window.history.replaceState(null, "", newHash);
                    } catch (error) {
                      // 静默处理错误，不影响用户体验
                      // 某些浏览器环境可能不支持此操作
                    }
                  }
                }
              }
              break;
            }
          }
        }
      }, 10);
    };

    mainContent.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      clearTimeout(observerTimer);
      clearTimeout(scrollTimer);
      observer.disconnect();
      mainContent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 使用智能滚动条 Hook
  useScrollbar(scrollContainerRef);

  const handleClick = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const mainContent = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
    
    if (mainContent) {
      const containerRect = mainContent.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = mainContent.scrollTop;
      const offsetTop = elementRect.top - containerRect.top + scrollTop - 80;
      
      mainContent.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    } else {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    
    setActiveId(id);
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "w-64 h-full flex flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black",
        className
      )}
      aria-label="本页大纲"
      role="navigation"
    >
      {/* 右侧目录内容 - 可滚动 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            本页大纲
          </h2>
          <nav className="space-y-1" role="list">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleClick(heading.id, e)}
                className={cn(
                  "flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors group",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white",
                  activeId === heading.id
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    : "text-gray-600 dark:text-gray-400"
                )}
                style={{ paddingLeft: `${(heading.level - 2) * 0.75 + 0.75}rem` }}
                aria-current={activeId === heading.id ? "location" : undefined}
              >
                <ChevronRight
                  className={cn(
                    "w-3 h-3 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    activeId === heading.id && "opacity-100"
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1 leading-relaxed">{heading.text}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
