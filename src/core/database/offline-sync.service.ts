import NetInfo from '@react-native-community/netinfo';
import { localDatabase } from './local-database';
import type { DatabaseCollection } from './collection';
import type {
  IOfflineMutation,
  OfflineMutationAction,
  OfflineSyncListener,
  OfflineSyncStatusEvent,
  SyncHandler,
  SyncResult,
} from './types';

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private readonly outbox: DatabaseCollection<IOfflineMutation>;
  private handlers: Map<string, SyncHandler<any>> = new Map();
  private listeners: Set<OfflineSyncListener> = new Set();
  private isSyncing = false;
  private lastSyncedAt: string | undefined;
  private netInfoUnsubscribe?: () => void;

  private constructor() {
    this.outbox = localDatabase.collection<IOfflineMutation>('_offline_outbox');
    this.setupNetworkListener();
  }

  public static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  /**
   * Listens for device reconnection and drains pending mutations automatically.
   */
  private setupNetworkListener(): void {
    try {
      this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected && !this.isSyncing) {
          const pending = this.getPendingCount();
          if (pending > 0) {
            this.processQueue().catch(() => {});
          }
        }
      });
    } catch {
      // Handles test environments where NetInfo might not have native event emitter
    }
  }

  /**
   * Notifies all registered listeners of sync state changes.
   */
  private notifyListeners(): void {
    const status: OfflineSyncStatusEvent = {
      isSyncing: this.isSyncing,
      pendingCount: this.getPendingCount(),
      failedCount: this.getFailedCount(),
      lastSyncedAt: this.lastSyncedAt,
    };

    this.listeners.forEach(listener => {
      try {
        listener(status);
      } catch {
        // Suppress listener error
      }
    });
  }

  /**
   * Enqueues an action/mutation into the offline outbox.
   */
  public enqueue<P = any>(
    entityType: string,
    action: OfflineMutationAction,
    payload: P,
    options?: { maxRetries?: number }
  ): IOfflineMutation<P> {
    const now = new Date().toISOString();
    const id = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const mutation: IOfflineMutation<P> = {
      id,
      entityType,
      action,
      payload,
      status: 'pending',
      retryCount: 0,
      maxRetries: options?.maxRetries ?? 5,
      createdAt: now,
      updatedAt: now,
    };

    this.outbox.insert(mutation);
    this.notifyListeners();

    // Optimistically attempt to process queue if already online
    NetInfo.fetch().then(state => {
      if (state.isConnected && !this.isSyncing) {
        this.processQueue().catch(() => {});
      }
    }).catch(() => {});

    return mutation;
  }

  /**
   * Registers a sync handler for a given entity type (e.g., 'food_order', 'dining_booking').
   */
  public registerHandler<P = any>(entityType: string, handler: SyncHandler<P>): () => void {
    this.handlers.set(entityType, handler);
    return () => {
      this.handlers.delete(entityType);
    };
  }

  /**
   * Processes all pending mutations in FIFO order.
   */
  public async processQueue(): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        total: 0,
        succeeded: 0,
        failed: 0,
        remaining: this.getPendingCount(),
      };
    }

    const pending = this.outbox.find(
      (item: IOfflineMutation) => item.status === 'pending' || (item.status === 'failed' && item.retryCount < item.maxRetries),
      { sort: { field: 'createdAt', order: 'asc' } }
    );

    if (pending.length === 0) {
      return {
        total: 0,
        succeeded: 0,
        failed: 0,
        remaining: 0,
      };
    }

    this.isSyncing = true;
    this.notifyListeners();

    let succeeded = 0;
    let failed = 0;

    for (const mutation of pending) {
      const handler = this.handlers.get(mutation.entityType);

      if (!handler) {
        // No handler registered yet for this entity type; keep pending
        continue;
      }

      this.outbox.update(mutation.id, {
        status: 'syncing',
        lastAttemptAt: new Date().toISOString(),
      });
      this.notifyListeners();

      try {
        await handler(mutation);
        this.outbox.update(mutation.id, {
          status: 'synced',
          updatedAt: new Date().toISOString(),
          error: undefined,
        });
        succeeded++;
      } catch (err: any) {
        const nextRetry = mutation.retryCount + 1;
        const isPermanentlyFailed = nextRetry >= mutation.maxRetries;
        this.outbox.update(mutation.id, {
          status: isPermanentlyFailed ? 'failed' : 'pending',
          retryCount: nextRetry,
          error: err?.message || String(err),
          updatedAt: new Date().toISOString(),
        });
        failed++;
      }

      this.notifyListeners();
    }

    this.isSyncing = false;
    this.lastSyncedAt = new Date().toISOString();
    this.notifyListeners();

    return {
      total: pending.length,
      succeeded,
      failed,
      remaining: this.getPendingCount(),
    };
  }

  /**
   * Returns all mutations that are still pending.
   */
  public getPendingMutations(): IOfflineMutation[] {
    return this.outbox.find((item: IOfflineMutation) => item.status === 'pending');
  }

  /**
   * Returns the count of pending mutations.
   */
  public getPendingCount(): number {
    return this.outbox.count((item: IOfflineMutation) => item.status === 'pending' || item.status === 'syncing');
  }

  /**
   * Returns the count of permanently failed mutations.
   */
  public getFailedCount(): number {
    return this.outbox.count((item: IOfflineMutation) => item.status === 'failed' && item.retryCount >= item.maxRetries);
  }

  /**
   * Resets retry counts for failed mutations and triggers a queue process.
   */
  public async retryFailed(): Promise<SyncResult> {
    const failedMutations = this.outbox.find((item: IOfflineMutation) => item.status === 'failed');
    failedMutations.forEach((m: IOfflineMutation) => {
      this.outbox.update(m.id, {
        status: 'pending',
        retryCount: 0,
        error: undefined,
      });
    });
    return this.processQueue();
  }

  /**
   * Removes all successfully synced mutations from the outbox.
   */
  public clearCompleted(): void {
    this.outbox.deleteMany((item: IOfflineMutation) => item.status === 'synced');
    this.notifyListeners();
  }

  /**
   * Cleans up all mutations (e.g., on logout).
   */
  public clearAll(): void {
    this.outbox.clear();
    this.notifyListeners();
  }

  /**
   * Subscribes to offline sync status changes.
   */
  public subscribe(listener: OfflineSyncListener): () => void {
    this.listeners.add(listener);
    // Emit initial status immediately
    listener({
      isSyncing: this.isSyncing,
      pendingCount: this.getPendingCount(),
      failedCount: this.getFailedCount(),
      lastSyncedAt: this.lastSyncedAt,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Destroys network listeners and cleans up resources.
   */
  public destroy(): void {
    this.netInfoUnsubscribe?.();
    this.listeners.clear();
    this.handlers.clear();
  }
}

export const offlineSync = OfflineSyncService.getInstance();

