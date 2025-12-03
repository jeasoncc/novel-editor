/**
 * 安全的 localStorage Hook
 * 处理 SSR 和错误情况
 */
export function useSafeLocalStorage() {
  const isClient = typeof window !== "undefined";

  const get = (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get localStorage key "${key}":`, error);
      return null;
    }
  };

  const set = (key: string, value: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage key "${key}":`, error);
      return false;
    }
  };

  const remove = (key: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
      return false;
    }
  };

  return { get, set, remove, isClient };
}

