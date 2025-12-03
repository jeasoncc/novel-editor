"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS_PER_MINUTE = 200; // 平均阅读速度：200 字/分钟

function calculateReadingTime(text: string): number {
  // 中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词数
  const englishWords = text.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
  // 总字数（中文字符 + 英文单词）
  const totalWords = chineseChars + englishWords;
  
  // 计算阅读时间（分钟）
  return Math.ceil(totalWords / WORDS_PER_MINUTE);
}

export function ReadingTime() {
  const [readingTime, setReadingTime] = useState<number | null>(null);

  useEffect(() => {
    const updateReadingTime = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const text = article.textContent || "";
      const time = calculateReadingTime(text);
      setReadingTime(time);
    };

    // 延迟计算，等待内容加载
    const timer = setTimeout(updateReadingTime, 500);

    // 监听内容变化
    const observer = new MutationObserver(() => {
      updateReadingTime();
    });

    const article = document.querySelector("article");
    if (article) {
      observer.observe(article, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (readingTime === null || readingTime === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400",
        "mb-4 px-1"
      )}
    >
      <Clock className="w-4 h-4" />
      <span>预计阅读时间：{readingTime} 分钟</span>
    </div>
  );
}

