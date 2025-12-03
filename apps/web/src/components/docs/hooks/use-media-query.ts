"use client";

import { useState, useEffect } from "react";

/**
 * 响应式 Hook
 * 监听媒体查询变化
 */
export function useMediaQuery(query: string): boolean {
  // SSR 安全：初始值设为 false，在客户端 hydration 时再更新
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 确保在客户端环境
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    
    // 初始化状态
    setMatches(mediaQuery.matches);

    // 监听变化
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const matchesValue = event.matches;
      setMatches(matchesValue);
    };

    // 现代浏览器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } 
    // 兼容旧浏览器
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}


