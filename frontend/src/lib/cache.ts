interface CacheItem<T> {
  value: T;
  expiry: number;
}

export const setCache = <T>(key: string, value: T, ttlMinutes: number) => {
  const expiry = Date.now() + ttlMinutes * 60 * 1000;
  const item: CacheItem<T> = { value, expiry };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCache = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item: CacheItem<T> = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
};

export const clearCache = (key: string) => {
  localStorage.removeItem(key);
};
