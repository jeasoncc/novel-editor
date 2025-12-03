"use client";

import { usePathname } from "next/navigation";
import { Calendar, Clock, Edit3 } from "lucide-react";
import { docNavItems, type NavItem } from "./doc-nav-data";

function findDocItem(pathname: string): NavItem | null {
  function search(items: NavItem[]): NavItem | null {
    for (const item of items) {
      if (item.href === pathname) {
        return item;
      }
      if (item.children) {
        const found = search(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(docNavItems);
}

export function MetadataDisplay() {
  const pathname = usePathname();
  
  if (pathname === "/docs") return null;

  // 这里可以从 CMS 或 API 获取元数据
  // 目前使用模拟数据
  const lastUpdated = "2024年1月"; // 可以从页面 frontmatter 获取

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
      {lastUpdated && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>最后更新：{lastUpdated}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Edit3 className="w-4 h-4" />
        <span>文档版本：v1.0</span>
      </div>
    </div>
  );
}

