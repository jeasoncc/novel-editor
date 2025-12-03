/**
 * 安全的 sessionStorage Hook
 * 处理 SSR 和错误情况
 */
export function useSafeSessionStorage() {
  const isClient = typeof window !== "undefined";

  const get = (key: string): string | null => {
    if (!isClient) return null;
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get sessionStorage key "${key}":`, error);
      return null;
    }
  };

  const set = (key: string, value: string): boolean => {
    if (!isClient) return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set sessionStorage key "${key}":`, error);
      return false;
    }
  };

  const remove = (key: string): boolean => {
    if (!isClient) return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove sessionStorage key "${key}":`, error);
      return false;
    }
  };

  return { get, set, remove, isClient };
}

