"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  onToggle: (collapsed: boolean) => void;
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取折叠状态
    const saved = localStorage.getItem("docs-sidebar-collapsed");
    if (saved === "true") {
      setCollapsed(true);
      onToggle(true);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle(newCollapsed);
    localStorage.setItem("docs-sidebar-collapsed", String(newCollapsed));
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="sm"
      className={cn(
        "fixed top-20 left-0 z-40 h-8 w-8 rounded-r-lg rounded-l-none",
        "bg-white dark:bg-black border-r border-t border-b border-gray-200 dark:border-gray-800",
        "lg:top-16",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "transition-all duration-300"
      )}
      aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
    >
      {collapsed ? (
        <ChevronRight className="w-4 h-4" />
      ) : (
        <ChevronLeft className="w-4 h-4" />
      )}
    </Button>
  );
}

