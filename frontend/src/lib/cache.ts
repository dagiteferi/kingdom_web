/**
 * Two-tier cache: in-memory (fast, no serialisation overhead) + localStorage
 * (survives page refresh).
 *
 * Pattern used everywhere: stale-while-revalidate
 *   1. Return cached value immediately (instant paint)
 *   2. Caller re-fetches fresh data in background and calls setCache again
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;          // unix ms
  storedAt: number;        // unix ms – used for stale-while-revalidate
}

// ─── in-memory store (cleared on hard refresh, survives SPA navigation) ──────
const memStore = new Map<string, CacheEntry<unknown>>();

// ─── read ──────────────────────────────────────────────────────────────────────
export function getCache<T>(key: string): T | null {
  // 1. Try memory first
  const mem = memStore.get(key) as CacheEntry<T> | undefined;
  if (mem) {
    if (Date.now() < mem.expiry) return mem.value;
    memStore.delete(key);
  }

  // 2. Try localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    // Warm the memory store from localStorage
    memStore.set(key, entry as CacheEntry<unknown>);
    return entry.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

// ─── write ─────────────────────────────────────────────────────────────────────
export function setCache<T>(key: string, value: T, ttlMinutes: number): void {
  const entry: CacheEntry<T> = {
    value,
    expiry: Date.now() + ttlMinutes * 60_000,
    storedAt: Date.now(),
  };
  // Always write to memory
  memStore.set(key, entry as CacheEntry<unknown>);
  // Best-effort write to localStorage (can fail if storage is full)
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable – memory cache is still good
  }
}

// ─── invalidate ────────────────────────────────────────────────────────────────
export function clearCache(key: string): void {
  memStore.delete(key);
  localStorage.removeItem(key);
}

// ─── prefetch helper ──────────────────────────────────────────────────────────
/**
 * Returns cached data immediately AND fires a background refresh.
 * The caller renders with stale data first, then re-renders when fresh data
 * arrives via the `onFresh` callback.
 */
export async function staleWhileRevalidate<T>(
  key: string,
  ttlMinutes: number,
  fetcher: () => Promise<T>,
  onFresh: (data: T) => void,
): Promise<T | null> {
  const cached = getCache<T>(key);
  // Always kick off a background fetch
  fetcher()
    .then((fresh) => {
      setCache(key, fresh, ttlMinutes);
      onFresh(fresh);
    })
    .catch(() => {/* background refresh failed – stale data still shows */});
  return cached;
}
