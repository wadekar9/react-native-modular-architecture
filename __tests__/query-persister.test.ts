import { QueryClient } from '@tanstack/react-query';
import {
  clearPersistedQueryCache,
  hydrateQueryClientCache,
  saveQueryClientCache,
  setupQueryCachePersister,
  DEFAULT_QUERY_CACHE_KEY,
} from '../src/core/networking/query-cache-persister';

describe('TanStack React Query MMKV Offline Persister', () => {
  const TEST_KEY = '@test:query_cache.v1';

  beforeEach(() => {
    clearPersistedQueryCache(TEST_KEY);
    clearPersistedQueryCache(DEFAULT_QUERY_CACHE_KEY);
  });

  it('saves and hydrates query cache into a new QueryClient instance', () => {
    const client1 = new QueryClient();
    client1.setQueryData(['recipes', 'list'], [
      { id: 1, name: 'Pasta Carbonara' },
      { id: 2, name: 'Margherita Pizza' },
    ]);

    saveQueryClientCache(client1, TEST_KEY);

    const client2 = new QueryClient();
    expect(client2.getQueryData(['recipes', 'list'])).toBeUndefined();

    const hydrated = hydrateQueryClientCache(client2, TEST_KEY);
    expect(hydrated).toBe(true);

    const cachedData = client2.getQueryData<any[]>(['recipes', 'list']);
    expect(cachedData).toBeDefined();
    expect(cachedData).toHaveLength(2);
    expect(cachedData?.[0].name).toBe('Pasta Carbonara');

    client1.clear();
    client2.clear();
  });

  it('returns false when no persisted cache exists', () => {
    const freshClient = new QueryClient();
    const result = hydrateQueryClientCache(freshClient, '@non_existent_key');
    expect(result).toBe(false);
    freshClient.clear();
  });

  it('purges persisted cache with clearPersistedQueryCache()', () => {
    const client = new QueryClient();
    client.setQueryData(['test'], { value: 123 });
    saveQueryClientCache(client, TEST_KEY);

    clearPersistedQueryCache(TEST_KEY);

    const client2 = new QueryClient();
    const restored = hydrateQueryClientCache(client2, TEST_KEY);
    expect(restored).toBe(false);
    expect(client2.getQueryData(['test'])).toBeUndefined();

    client.clear();
    client2.clear();
  });

  it('sets up reactive persistence listener on query cache updates', async () => {
    jest.useFakeTimers();
    const client = new QueryClient();
    const teardown = setupQueryCachePersister(client, {
      storageKey: TEST_KEY,
      throttleMs: 50,
    });

    client.setQueryData(['reactive', 'item'], { title: 'Async Persist' });

    jest.advanceTimersByTime(100);

    const client2 = new QueryClient();
    hydrateQueryClientCache(client2, TEST_KEY);
    expect(client2.getQueryData(['reactive', 'item'])).toEqual({ title: 'Async Persist' });

    teardown();
    client.clear();
    client2.clear();
    jest.useRealTimers();
  });
});

