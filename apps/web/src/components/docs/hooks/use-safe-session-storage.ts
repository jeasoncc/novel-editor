"use client";

import { useCallback, useMemo } from "react";

/**
 * 安全的 sessionStorage Hook
 * 处理 SSR 和错误情况
 */
export function useSafeSessionStorage() {
  const isClient = useMemo(() => typeof window !== "undefined", []);

  const get = useCallback((key: string): string | null => {
    if (!isClient) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get sessionStorage key "${key}":`, error);
      return null;
    }
  }, [isClient]);

  const set = useCallback((key: string, value: string): boolean => {
    if (!isClient) return false;
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set sessionStorage key "${key}":`, error);
      return false;
    }
  }, [isClient]);

  const remove = useCallback((key: string): boolean => {
    if (!isClient) return false;
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove sessionStorage key "${key}":`, error);
      return false;
    }
  }, [isClient]);

  return useMemo(
    () => ({ get, set, remove, isClient }),
    [get, set, remove, isClient]
  );
}
