import { createMMKV } from 'react-native-mmkv';
import type {
  BatchOperation,
  DatabaseChangeEvent,
  DatabaseChangeListener,
  IDatabaseRecord,
  QueryOptions,
  QueryPredicate,
  RecordId,
} from './types';

export class DatabaseCollection<T extends IDatabaseRecord> {
  private readonly name: string;
  private readonly storageKey: string;
  private readonly storage: ReturnType<typeof createMMKV>;
  private cache: Map<RecordId, T> | null = null;
  private listeners: Set<DatabaseChangeListener<T>> = new Set();

  constructor(collectionName: string) {
    this.name = collectionName;
    this.storageKey = `@superapp_db:${collectionName}:_records`;
    this.storage = createMMKV({ id: `superapp_db_${collectionName}` });
  }

  public getName(): string {
    return this.name;
  }

  /**
   * Lazily loads and caches the records from MMKV storage into memory.
   */
  private getCache(): Map<RecordId, T> {
    if (this.cache === null) {
      this.cache = new Map<RecordId, T>();
      try {
        const raw = this.storage.getString(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, T>;
          if (parsed && typeof parsed === 'object') {
            Object.values(parsed).forEach(item => {
              if (item && item.id !== undefined && item.id !== null) {
                this.cache!.set(String(item.id), item);
              }
            });
          }
        }
      } catch (err) {
        // Fallback to empty map on corruption or parse error
        this.cache = new Map<RecordId, T>();
      }
    }
    return this.cache;
  }

  /**
   * Writes the current in-memory cache to persistent MMKV storage.
   */
  private persistCache(): void {
    const cache = this.getCache();
    const recordsObj: Record<string, T> = {};
    cache.forEach((value, key) => {
      recordsObj[String(key)] = value;
    });

    try {
      this.storage.set(this.storageKey, JSON.stringify(recordsObj));
    } catch {
      // Storage write error handling
    }
  }

  /**
   * Emits a change event to all registered listeners.
   */
  private notifyListeners(event: DatabaseChangeEvent<T>): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch {
        // Prevent listener errors from breaking database operations
      }
    });
  }

  /**
   * Generates a unique record identifier if one is not provided.
   */
  private generateId(): string {
    return `${this.name}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Deep clone helper to prevent external mutation of database records.
   */
  private clone<R>(data: R): R {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Inserts a single record into the collection.
   */
  public insert(item: Omit<T, 'id'> & { id?: RecordId }): T {
    const cache = this.getCache();
    const id = item.id !== undefined && item.id !== null ? String(item.id) : this.generateId();

    if (cache.has(id)) {
      throw new Error(`Record with id "${id}" already exists in collection "${this.name}". Use upsert() or update().`);
    }

    const now = new Date().toISOString();
    const record = {
      ...item,
      id,
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    } as unknown as T;

    cache.set(id, record);
    this.persistCache();

    const cloned = this.clone(record);
    this.notifyListeners({
      type: 'insert',
      collectionName: this.name,
      records: [cloned],
      recordIds: [id],
    });

    return cloned;
  }

  /**
   * Inserts multiple records in a single batch operation.
   */
  public insertMany(items: Array<Omit<T, 'id'> & { id?: RecordId }>): T[] {
    const cache = this.getCache();
    const insertedRecords: T[] = [];
    const insertedIds: RecordId[] = [];
    const now = new Date().toISOString();

    for (const item of items) {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : this.generateId();
      if (cache.has(id)) {
        throw new Error(`Record with id "${id}" already exists in collection "${this.name}".`);
      }
      const record = {
        ...item,
        id,
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now,
      } as unknown as T;

      cache.set(id, record);
      insertedRecords.push(record);
      insertedIds.push(id);
    }

    this.persistCache();

    const cloned = this.clone(insertedRecords);
    this.notifyListeners({
      type: 'insert',
      collectionName: this.name,
      records: cloned,
      recordIds: insertedIds,
    });

    return cloned;
  }

  /**
   * Retrieves a record by its unique ID.
   */
  public findById(id: RecordId): T | null {
    const cache = this.getCache();
    const record = cache.get(String(id));
    return record ? this.clone(record) : null;
  }

  /**
   * Finds records matching a predicate or filter object, with optional sorting and pagination.
   */
  public find(predicate?: QueryPredicate<T>, options?: QueryOptions<T>): T[] {
    const cache = this.getCache();
    let records = Array.from(cache.values());

    // Apply filtering
    if (typeof predicate === 'function') {
      records = records.filter(predicate);
    } else if (predicate && typeof predicate === 'object') {
      const entries = Object.entries(predicate);
      records = records.filter(item => {
        return entries.every(([key, value]) => (item as any)[key] === value);
      });
    }

    // Apply sorting
    if (options?.sort) {
      const { field, order = 'asc' } = options.sort;
      const multiplier = order === 'desc' ? -1 : 1;

      records.sort((a, b) => {
        const valA = (a as any)[field];
        const valB = (b as any)[field];

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1 * multiplier;
        if (valB === undefined || valB === null) return -1 * multiplier;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }

        return String(valA).localeCompare(String(valB)) * multiplier;
      });
    }

    // Apply pagination
    if (options?.skip !== undefined && options.skip > 0) {
      records = records.slice(options.skip);
    }
    if (options?.limit !== undefined && options.limit >= 0) {
      records = records.slice(0, options.limit);
    }

    return this.clone(records);
  }

  /**
   * Finds the first record matching the predicate, or null if none found.
   */
  public findOne(predicate?: QueryPredicate<T>): T | null {
    const results = this.find(predicate, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Returns all records in the collection.
   */
  public getAll(): T[] {
    return this.find();
  }

  /**
   * Updates an existing record by ID.
   */
  public update(id: RecordId, patch: Partial<T>): T | null {
    const cache = this.getCache();
    const strId = String(id);
    const existing = cache.get(strId);

    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...patch,
      id: existing.id, // Preserve original ID
      updatedAt: new Date().toISOString(),
    } as T;

    cache.set(strId, updated);
    this.persistCache();

    const cloned = this.clone(updated);
    this.notifyListeners({
      type: 'update',
      collectionName: this.name,
      records: [cloned],
      recordIds: [strId],
    });

    return cloned;
  }

  /**
   * Inserts or updates a record.
   */
  public upsert(item: Partial<T> & { id: RecordId }): T {
    const cache = this.getCache();
    const strId = String(item.id);
    const existing = cache.get(strId);
    const now = new Date().toISOString();

    let record: T;
    let changeType: 'insert' | 'update' = 'update';

    if (existing) {
      record = {
        ...existing,
        ...item,
        id: existing.id,
        updatedAt: now,
      } as T;
    } else {
      changeType = 'insert';
      record = {
        ...item,
        id: strId,
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now,
      } as unknown as T;
    }

    cache.set(strId, record);
    this.persistCache();

    const cloned = this.clone(record);
    this.notifyListeners({
      type: changeType,
      collectionName: this.name,
      records: [cloned],
      recordIds: [strId],
    });

    return cloned;
  }

  /**
   * Upserts multiple records in a single batch.
   */
  public upsertMany(items: Array<Partial<T> & { id: RecordId }>): T[] {
    const cache = this.getCache();
    const upsertedRecords: T[] = [];
    const upsertedIds: RecordId[] = [];
    const now = new Date().toISOString();

    for (const item of items) {
      const strId = String(item.id);
      const existing = cache.get(strId);
      let record: T;

      if (existing) {
        record = {
          ...existing,
          ...item,
          id: existing.id,
          updatedAt: now,
        } as T;
      } else {
        record = {
          ...item,
          id: strId,
          createdAt: item.createdAt || now,
          updatedAt: item.updatedAt || now,
        } as unknown as T;
      }

      cache.set(strId, record);
      upsertedRecords.push(record);
      upsertedIds.push(strId);
    }

    this.persistCache();

    const cloned = this.clone(upsertedRecords);
    this.notifyListeners({
      type: 'upsert',
      collectionName: this.name,
      records: cloned,
      recordIds: upsertedIds,
    });

    return cloned;
  }

  /**
   * Deletes a record by ID.
   */
  public delete(id: RecordId): boolean {
    const cache = this.getCache();
    const strId = String(id);
    const existing = cache.get(strId);

    if (!existing) {
      return false;
    }

    cache.delete(strId);
    this.persistCache();

    this.notifyListeners({
      type: 'delete',
      collectionName: this.name,
      records: [this.clone(existing)],
      recordIds: [strId],
    });

    return true;
  }

  /**
   * Deletes all records matching the predicate.
   */
  public deleteMany(predicate?: (item: T) => boolean): number {
    const cache = this.getCache();
    const deletedRecords: T[] = [];
    const deletedIds: RecordId[] = [];

    cache.forEach((record, id) => {
      if (!predicate || predicate(record)) {
        deletedRecords.push(record);
        deletedIds.push(id);
      }
    });

    if (deletedIds.length === 0) {
      return 0;
    }

    deletedIds.forEach(id => cache.delete(id));
    this.persistCache();

    this.notifyListeners({
      type: 'delete',
      collectionName: this.name,
      records: this.clone(deletedRecords),
      recordIds: deletedIds,
    });

    return deletedIds.length;
  }

  /**
   * Returns the count of records in the collection matching an optional predicate.
   */
  public count(predicate?: (item: T) => boolean): number {
    const cache = this.getCache();
    if (!predicate) {
      return cache.size;
    }
    let count = 0;
    cache.forEach(item => {
      if (predicate(item)) {
        count++;
      }
    });
    return count;
  }

  /**
   * Clears all records from the collection.
   */
  public clear(): void {
    const cache = this.getCache();
    cache.clear();

    try {
      this.storage.remove(this.storageKey);
    } catch {}

    this.notifyListeners({
      type: 'clear',
      collectionName: this.name,
      records: [],
      recordIds: [],
    });
  }

  /**
   * Executes a batch of heterogeneous operations atomically.
   */
  public batch(operations: Array<BatchOperation<T>>): void {
    const cache = this.getCache();
    const affectedRecords: T[] = [];
    const affectedIds: RecordId[] = [];
    const now = new Date().toISOString();

    for (const op of operations) {
      switch (op.type) {
        case 'insert': {
          const id = op.record.id !== undefined && op.record.id !== null ? String(op.record.id) : this.generateId();
          const record = {
            ...op.record,
            id,
            createdAt: op.record.createdAt || now,
            updatedAt: op.record.updatedAt || now,
          } as unknown as T;
          cache.set(id, record);
          affectedRecords.push(record);
          affectedIds.push(id);
          break;
        }
        case 'update': {
          const strId = String(op.id);
          const existing = cache.get(strId);
          if (existing) {
            const updated = {
              ...existing,
              ...op.patch,
              id: existing.id,
              updatedAt: now,
            } as T;
            cache.set(strId, updated);
            affectedRecords.push(updated);
            affectedIds.push(strId);
          }
          break;
        }
        case 'upsert': {
          const strId = String(op.record.id);
          const existing = cache.get(strId);
          let record: T;
          if (existing) {
            record = {
              ...existing,
              ...op.record,
              id: existing.id,
              updatedAt: now,
            } as T;
          } else {
            record = {
              ...op.record,
              id: strId,
              createdAt: op.record.createdAt || now,
              updatedAt: op.record.updatedAt || now,
            } as unknown as T;
          }
          cache.set(strId, record);
          affectedRecords.push(record);
          affectedIds.push(strId);
          break;
        }
        case 'delete': {
          const strId = String(op.id);
          const existing = cache.get(strId);
          if (existing) {
            cache.delete(strId);
            affectedRecords.push(existing);
            affectedIds.push(strId);
          }
          break;
        }
      }
    }

    this.persistCache();

    this.notifyListeners({
      type: 'batch',
      collectionName: this.name,
      records: this.clone(affectedRecords),
      recordIds: affectedIds,
    });
  }

  /**
   * Subscribes to changes on this collection.
   * Returns an unsubscribe function.
   */
  public subscribe(listener: DatabaseChangeListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

