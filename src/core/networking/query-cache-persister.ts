import { dehydrate, hydrate, type DehydratedState, type QueryClient } from '@tanstack/react-query';
import { getJson, Storage } from '@core/storage/storage';

export const DEFAULT_QUERY_CACHE_KEY = '@superapp:query_cache.v1';

export interface QueryCachePersisterOptions {
  storageKey?: string;
  throttleMs?: number;
  maxAgeMs?: number;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Hydrates queryClient with persisted cache from MMKV.
 * Returns true if cached data was restored, false otherwise.
 */
export const hydrateQueryClientCache = (
  client: QueryClient,
  storageKey: string = DEFAULT_QUERY_CACHE_KEY
): boolean => {
  try {
    const raw = getJson<{ timestamp: number; state: DehydratedState }>(storageKey);
    if (!raw || !raw.state) {
      return false;
    }

    hydrate(client, raw.state);
    return true;
  } catch {
    return false;
  }
};

/**
 * Saves current queryClient state into MMKV immediately.
 */
export const saveQueryClientCache = (
  client: QueryClient,
  storageKey: string = DEFAULT_QUERY_CACHE_KEY
): void => {
  try {
    const dehydrated = dehydrate(client, {
      shouldDehydrateQuery: query => query.state.status === 'success',
    });

    Storage.set(storageKey, {
      timestamp: Date.now(),
      state: dehydrated,
    });
  } catch {
    // Suppress storage persistence error
  }
};

/**
 * Attaches a reactive listener to queryClient's cache that debounces and persists
 * successful queries to MMKV for offline access across app launches.
 * Returns a teardown function.
 */
export const setupQueryCachePersister = (
  client: QueryClient,
  options: QueryCachePersisterOptions = {}
): (() => void) => {
  const { storageKey = DEFAULT_QUERY_CACHE_KEY, throttleMs = 800 } = options;

  // Hydrate initial cache on setup
  hydrateQueryClientCache(client, storageKey);

  const unsubscribe = client.getQueryCache().subscribe(event => {
    if (event.type === 'updated' || event.type === 'added' || event.type === 'removed') {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        saveQueryClientCache(client, storageKey);
        debounceTimer = null;
      }, throttleMs);
    }
  });

  return () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    unsubscribe();
  };
};

/**
 * Purges persisted React Query offline cache from MMKV.
 */
export const clearPersistedQueryCache = (storageKey: string = DEFAULT_QUERY_CACHE_KEY): void => {
  try {
    Storage.delete(storageKey);
  } catch {}
};

