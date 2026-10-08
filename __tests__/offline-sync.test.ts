import { offlineSync } from '../src/core/database/offline-sync.service';

describe('OfflineSyncService (Outbox Pattern)', () => {
  beforeEach(() => {
    offlineSync.clearAll();
  });

  afterAll(() => {
    offlineSync.destroy();
  });

  it('enqueues mutations into the offline outbox', () => {
    const mutation = offlineSync.enqueue('test_order', 'create', {
      orderId: 'ORD-123',
      amount: 450,
    });

    expect(mutation.id).toBeDefined();
    expect(mutation.entityType).toBe('test_order');
    expect(mutation.action).toBe('create');
    expect(mutation.status).toBe('pending');
    expect(mutation.retryCount).toBe(0);

    const pending = offlineSync.getPendingMutations();
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe(mutation.id);
  });

  it('processes mutations in FIFO order with registered handlers', async () => {
    const executed: string[] = [];

    const unregister = offlineSync.registerHandler('order', async mutation => {
      executed.push(mutation.payload.ref);
    });

    offlineSync.enqueue('order', 'create', { ref: 'first' });
    offlineSync.enqueue('order', 'create', { ref: 'second' });
    offlineSync.enqueue('order', 'create', { ref: 'third' });

    expect(offlineSync.getPendingCount()).toBe(3);

    const result = await offlineSync.processQueue();

    expect(result.total).toBe(3);
    expect(result.succeeded).toBe(3);
    expect(result.failed).toBe(0);
    expect(executed).toEqual(['first', 'second', 'third']);
    expect(offlineSync.getPendingCount()).toBe(0);

    unregister();
  });

  it('handles failed mutations and increments retry count up to maxRetries', async () => {
    let callCount = 0;
    const unregister = offlineSync.registerHandler('failing_action', async () => {
      callCount++;
      throw new Error('Network timeout');
    });

    offlineSync.enqueue('failing_action', 'update', { id: 1 }, { maxRetries: 2 });

    // First attempt -> retryCount becomes 1, status remains 'pending'
    await offlineSync.processQueue();
    let pending = offlineSync.getPendingMutations();
    expect(pending[0].retryCount).toBe(1);
    expect(pending[0].status).toBe('pending');
    expect(pending[0].error).toBe('Network timeout');

    // Second attempt -> retryCount becomes 2 (matches maxRetries 2) -> status becomes 'failed'
    await offlineSync.processQueue();
    expect(offlineSync.getFailedCount()).toBe(1);
    expect(offlineSync.getPendingCount()).toBe(0);

    expect(callCount).toBe(2);
    unregister();
  });

  it('resets failed mutations and retries with retryFailed()', async () => {
    let shouldFail = true;
    const unregister = offlineSync.registerHandler('flaky_action', async () => {
      if (shouldFail) {
        throw new Error('Server unavailable');
      }
    });

    offlineSync.enqueue('flaky_action', 'create', { data: 'test' }, { maxRetries: 1 });

    // Fails on first run
    await offlineSync.processQueue();
    expect(offlineSync.getFailedCount()).toBe(1);

    // Network recovers: retry
    shouldFail = false;
    const result = await offlineSync.retryFailed();
    expect(result.succeeded).toBe(1);
    expect(offlineSync.getFailedCount()).toBe(0);
    expect(offlineSync.getPendingCount()).toBe(0);

    unregister();
  });

  it('removes completed mutations with clearCompleted()', async () => {
    const unregister = offlineSync.registerHandler('quick_action', async () => {});

    offlineSync.enqueue('quick_action', 'create', { val: 1 });
    await offlineSync.processQueue();

    offlineSync.clearCompleted();
    expect(offlineSync.getPendingCount()).toBe(0);
    expect(offlineSync.getFailedCount()).toBe(0);

    unregister();
  });

  it('notifies status listeners on sync lifecycle events', async () => {
    const listener = jest.fn();
    const unsubscribe = offlineSync.subscribe(listener);

    const unregister = offlineSync.registerHandler('notified_action', async () => {});

    offlineSync.enqueue('notified_action', 'create', {});
    await offlineSync.processQueue();

    expect(listener).toHaveBeenCalled();
    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.isSyncing).toBe(false);
    expect(lastCall.pendingCount).toBe(0);

    unsubscribe();
    unregister();
  });
});
