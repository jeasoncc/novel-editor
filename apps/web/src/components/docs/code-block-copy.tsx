"use client";

import { useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 为代码块添加复制按钮
 */
export function CodeBlockCopy() {
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("article pre");
      
      codeBlocks.forEach((pre) => {
        // 如果已经有复制按钮，跳过
        if (pre.querySelector(".code-copy-button")) return;
        
        const code = pre.querySelector("code");
        if (!code) return;

        // 创建复制按钮容器
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "code-copy-button-container absolute top-2 right-2 z-10";
        
        // 创建复制按钮
        const button = document.createElement("button");
        button.className = cn(
          "code-copy-button",
          "flex items-center justify-center",
          "w-8 h-8 rounded-md",
          "bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm text-white",
          "hover:bg-gray-800 dark:hover:bg-gray-700",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "border border-gray-700 dark:border-gray-600",
          "shadow-lg"
        );
        button.setAttribute("aria-label", "复制代码");
        button.title = "复制代码";
        button.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
        
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const text = code.textContent || "";
          
          try {
            await navigator.clipboard.writeText(text);
            button.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
            button.classList.remove("bg-gray-900/80", "dark:bg-gray-800/80");
            button.classList.add("bg-green-600", "dark:bg-green-700");
            button.setAttribute("aria-label", "已复制");
            
            setTimeout(() => {
              button.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
              button.classList.remove("bg-green-600", "dark:bg-green-700");
              button.classList.add("bg-gray-900/80", "dark:bg-gray-800/80");
              button.setAttribute("aria-label", "复制代码");
            }, 2000);
          } catch (err) {
            console.error("复制失败:", err);
          }
        });
        
        buttonContainer.appendChild(button);
        
        // 为 pre 添加相对定位和 hover group
        pre.classList.add("relative", "group");
        pre.appendChild(buttonContainer);
      });
    };

    // 延迟执行，等待内容加载
    const timer = setTimeout(addCopyButtons, 500);
    
    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
      setTimeout(addCopyButtons, 300);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}

