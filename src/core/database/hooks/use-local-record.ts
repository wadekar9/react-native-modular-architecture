import { useCallback, useEffect, useState } from 'react';
import { localDatabase } from '../local-database';
import type { IDatabaseRecord, RecordId } from '../types';

export interface UseLocalRecordResult<T extends IDatabaseRecord> {
  record: T | null;
  loading: boolean;
  update: (patch: Partial<T>) => T | null;
  remove: () => boolean;
  refresh: () => void;
}

export function useLocalRecord<T extends IDatabaseRecord>(
  collectionName: string,
  id: RecordId | null | undefined
): UseLocalRecordResult<T> {
  const collection = localDatabase.collection<T>(collectionName);
  const [record, setRecord] = useState<T | null>(() => (id ? collection.findById(id) : null));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (id !== null && id !== undefined) {
      setRecord(collection.findById(id));
    } else {
      setRecord(null);
    }
  }, [collection, id]);

  useEffect(() => {
    if (id === null || id === undefined) {
      setRecord(null);
      return;
    }

    setRecord(collection.findById(id));

    const unsubscribe = collection.subscribe(event => {
      if (event.type === 'clear' || event.recordIds.map(String).includes(String(id))) {
        setRecord(collection.findById(id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [collection, id]);

  const update = useCallback(
    (patch: Partial<T>) => {
      if (!id) return null;
      return collection.update(id, patch);
    },
    [collection, id]
  );

  const remove = useCallback(() => {
    if (!id) return false;
    return collection.delete(id);
  }, [collection, id]);

  return {
    record,
    loading,
    update,
    remove,
    refresh,
  };
}

