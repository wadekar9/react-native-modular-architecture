import { useCallback, useEffect, useState } from 'react';
import { localDatabase } from '../local-database';
import type {
  IDatabaseRecord,
  QueryOptions,
  QueryPredicate,
  RecordId,
} from '../types';

export interface UseLocalCollectionResult<T extends IDatabaseRecord> {
  data: T[];
  loading: boolean;
  count: number;
  insert: (item: Omit<T, 'id'> & { id?: RecordId }) => T;
  update: (id: RecordId, patch: Partial<T>) => T | null;
  upsert: (item: Partial<T> & { id: RecordId }) => T;
  remove: (id: RecordId) => boolean;
  refresh: () => void;
}

export function useLocalCollection<T extends IDatabaseRecord>(
  collectionName: string,
  predicate?: QueryPredicate<T>,
  options?: QueryOptions<T>
): UseLocalCollectionResult<T> {
  const collection = localDatabase.collection<T>(collectionName);
  const [data, setData] = useState<T[]>(() => collection.find(predicate, options));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setData(collection.find(predicate, options));
  }, [collection, predicate, options]);

  useEffect(() => {
    // Initial fetch on mount or options change
    setData(collection.find(predicate, options));

    const unsubscribe = collection.subscribe(() => {
      setData(collection.find(predicate, options));
    });

    return () => {
      unsubscribe();
    };
  }, [collection, predicate, options]);

  const insert = useCallback(
    (item: Omit<T, 'id'> & { id?: RecordId }) => collection.insert(item),
    [collection]
  );

  const update = useCallback(
    (id: RecordId, patch: Partial<T>) => collection.update(id, patch),
    [collection]
  );

  const upsert = useCallback(
    (item: Partial<T> & { id: RecordId }) => collection.upsert(item),
    [collection]
  );

  const remove = useCallback(
    (id: RecordId) => collection.delete(id),
    [collection]
  );

  return {
    data,
    loading,
    count: data.length,
    insert,
    update,
    upsert,
    remove,
    refresh,
  };
}

