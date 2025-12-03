"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSafeLocalStorage } from "./hooks/use-safe-local-storage";

type FontSize = "sm" | "base" | "lg" | "xl";

const fontSizeClasses: Record<FontSize, string> = {
  sm: "prose-sm",
  base: "prose-base",
  lg: "prose-lg",
  xl: "prose-xl",
};

const fontSizeLabels: Record<FontSize, string> = {
  sm: "小",
  base: "中",
  lg: "大",
  xl: "特大",
};

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState<FontSize>("lg");
  const { get, set: setStorage } = useSafeLocalStorage();

  useEffect(() => {
    // 从 localStorage 读取字体大小
    const saved = get("docs-font-size") as FontSize;
    if (saved && fontSizeClasses[saved]) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, [get]);

  const applyFontSize = (size: FontSize) => {
    // 使用更具体的选择器查找文章元素
    const article = document.querySelector("article.docs-article") || 
                    document.querySelector("article[class*='prose']") ||
                    document.querySelector("article");
    
    if (!article) return;

    // 移除所有字体大小类
    Object.values(fontSizeClasses).forEach((cls) => {
      article.classList.remove(cls);
    });

    // 添加新的字体大小类
    article.classList.add(fontSizeClasses[size]);
    
    // 同时应用到文档容器
    const container = article.closest('.docs-article') || article;
    Object.values(fontSizeClasses).forEach((cls) => {
      if (container !== article) {
        container.classList.remove(cls);
      }
    });
    if (container !== article) {
      container.classList.add(fontSizeClasses[size]);
    }
  };

  const handleDecrease = () => {
    const sizes: FontSize[] = ["xl", "lg", "base", "sm"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      const newSize = sizes[currentIndex + 1];
      setFontSize(newSize);
      applyFontSize(newSize);
      setStorage("docs-font-size", newSize);
    }
  };

  const handleIncrease = () => {
    const sizes: FontSize[] = ["xl", "lg", "base", "sm"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const newSize = sizes[currentIndex - 1];
      setFontSize(newSize);
      applyFontSize(newSize);
      setStorage("docs-font-size", newSize);
    }
  };

  return (
    <div className="fixed bottom-32 right-[calc(50%-32rem+1rem)] z-50 hidden xl:flex items-center gap-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-2">
      <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <Button
        onClick={handleDecrease}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={fontSize === "sm"}
        aria-label="减小字体"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
        {fontSizeLabels[fontSize]}
      </span>
      <Button
        onClick={handleIncrease}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={fontSize === "xl"}
        aria-label="增大字体"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}

