export type RecordId = string | number;

export interface IDatabaseRecord {
  id: RecordId;
  createdAt?: string;
  updatedAt?: string;
  _syncStatus?: 'synced' | 'pending' | 'failed';
  [key: string]: any;
}

export type QueryPredicate<T> = Partial<T> | ((item: T) => boolean);

export type SortOrder = 'asc' | 'desc';

export interface SortOptions<T> {
  field: keyof T;
  order?: SortOrder;
}

export interface QueryOptions<T> {
  sort?: SortOptions<T>;
  limit?: number;
  skip?: number;
}

export type DatabaseChangeType = 'insert' | 'update' | 'upsert' | 'delete' | 'clear' | 'batch';

export interface DatabaseChangeEvent<T extends IDatabaseRecord = IDatabaseRecord> {
  type: DatabaseChangeType;
  collectionName: string;
  records: T[];
  recordIds: RecordId[];
}

export type DatabaseChangeListener<T extends IDatabaseRecord = IDatabaseRecord> = (
  event: DatabaseChangeEvent<T>
) => void;

export type BatchOperation<T extends IDatabaseRecord> =
  | { type: 'insert'; record: Omit<T, 'id'> & { id?: RecordId } }
  | { type: 'update'; id: RecordId; patch: Partial<T> }
  | { type: 'upsert'; record: Partial<T> & { id: RecordId } }
  | { type: 'delete'; id: RecordId };

export type OfflineMutationStatus = 'pending' | 'syncing' | 'synced' | 'failed';
export type OfflineMutationAction = 'create' | 'update' | 'delete';

export interface IOfflineMutation<P = any> extends IDatabaseRecord {
  id: string;
  entityType: string;
  action: OfflineMutationAction;
  payload: P;
  status: OfflineMutationStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

export type SyncHandler<P = any> = (mutation: IOfflineMutation<P>) => Promise<boolean | void>;

export interface SyncResult {
  total: number;
  succeeded: number;
  failed: number;
  remaining: number;
}

export interface OfflineSyncStatusEvent {
  isSyncing: boolean;
  pendingCount: number;
  failedCount: number;
  lastSyncedAt?: string;
}

export type OfflineSyncListener = (status: OfflineSyncStatusEvent) => void;

