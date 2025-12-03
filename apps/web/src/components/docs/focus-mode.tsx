"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusModeProps {
  onToggle?: (focused: boolean) => void;
}

export function FocusMode({ onToggle }: FocusModeProps) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取状态
    const saved = localStorage.getItem("docs-focus-mode");
    if (saved === "true") {
      setIsFocused(true);
      onToggle?.(true);
    }
  }, [onToggle]);

  const toggleFocusMode = () => {
    const newFocused = !isFocused;
    setIsFocused(newFocused);
    localStorage.setItem("docs-focus-mode", String(newFocused));
    onToggle?.(newFocused);
  };

  return (
    <Button
      onClick={toggleFocusMode}
      variant="ghost"
      size="sm"
      className={cn(
        "fixed bottom-8 left-8 z-50 rounded-full p-3 shadow-lg",
        "bg-white dark:bg-black border border-gray-200 dark:border-gray-800",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "text-gray-600 dark:text-gray-400",
        "lg:bottom-8 lg:left-8"
      )}
      aria-label={isFocused ? "退出专注模式" : "进入专注模式"}
      title={isFocused ? "退出专注模式" : "进入专注模式（隐藏侧边栏）"}
    >
      {isFocused ? (
        <Minimize2 className="w-5 h-5" />
      ) : (
        <Maximize2 className="w-5 h-5" />
      )}
    </Button>
  );
}

