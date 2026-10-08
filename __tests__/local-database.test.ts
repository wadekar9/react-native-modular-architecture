import { localDatabase, DatabaseCollection, type IDatabaseRecord } from '../src/core/database';

describe('LocalDatabase and DatabaseCollection', () => {
  beforeEach(() => {
    localDatabase.clearAll();
  });

  describe('DatabaseCollection CRUD and Queries', () => {
    interface TestUser extends IDatabaseRecord {
      id: string;
      name: string;
      age: number;
      role: string;
    }

    let collection: DatabaseCollection<TestUser>;

    beforeEach(() => {
      collection = localDatabase.collection<TestUser>('test_users');
      collection.clear();
    });

    it('inserts and retrieves records by ID', () => {
      const inserted = collection.insert({
        id: 'u1',
        name: 'Alice',
        age: 30,
        role: 'admin',
      });

      expect(inserted.id).toBe('u1');
      expect(inserted.name).toBe('Alice');
      expect(inserted.createdAt).toBeDefined();
      expect(inserted.updatedAt).toBeDefined();

      const found = collection.findById('u1');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Alice');
      expect(found?.age).toBe(30);
    });

    it('generates an ID if none is provided on insert', () => {
      const inserted = collection.insert({
        name: 'Bob',
        age: 25,
        role: 'user',
      });

      expect(inserted.id).toBeDefined();
      expect(typeof inserted.id).toBe('string');
      expect(collection.findById(inserted.id)).not.toBeNull();
    });

    it('throws error when inserting duplicate ID', () => {
      collection.insert({ id: 'u1', name: 'Alice', age: 30, role: 'admin' });
      expect(() => {
        collection.insert({ id: 'u1', name: 'Duplicate', age: 20, role: 'user' });
      }).toThrow();
    });

    it('inserts multiple records in batch with insertMany', () => {
      const users = collection.insertMany([
        { id: 'u1', name: 'Alice', age: 30, role: 'admin' },
        { id: 'u2', name: 'Bob', age: 25, role: 'user' },
        { id: 'u3', name: 'Charlie', age: 35, role: 'user' },
      ]);

      expect(users).toHaveLength(3);
      expect(collection.count()).toBe(3);
    });

    it('updates records partially and updates timestamp', () => {
      collection.insert({ id: 'u1', name: 'Alice', age: 30, role: 'admin' });
      const updated = collection.update('u1', { age: 31 });

      expect(updated).not.toBeNull();
      expect(updated?.age).toBe(31);
      expect(updated?.name).toBe('Alice');
      expect(collection.findById('u1')?.age).toBe(31);
    });

    it('returns null when updating non-existent record', () => {
      const result = collection.update('non_existent', { age: 40 });
      expect(result).toBeNull();
    });

    it('upserts new and existing records correctly', () => {
      // First upsert inserts
      const created = collection.upsert({ id: 'u1', name: 'Alice', age: 30, role: 'admin' });
      expect(created.name).toBe('Alice');
      expect(collection.count()).toBe(1);

      // Second upsert updates
      const updated = collection.upsert({ id: 'u1', name: 'Alice Updated', age: 32 });
      expect(updated.name).toBe('Alice Updated');
      expect(updated.age).toBe(32);
      expect(updated.role).toBe('admin'); // Preserves unmodified fields
      expect(collection.count()).toBe(1);
    });

    it('filters records using predicate function and object matching', () => {
      collection.insertMany([
        { id: 'u1', name: 'Alice', age: 30, role: 'admin' },
        { id: 'u2', name: 'Bob', age: 25, role: 'user' },
        { id: 'u3', name: 'Charlie', age: 35, role: 'user' },
      ]);

      // Object matching
      const users = collection.find({ role: 'user' });
      expect(users).toHaveLength(2);

      // Predicate function
      const over30 = collection.find(item => item.age > 30);
      expect(over30).toHaveLength(1);
      expect(over30[0].name).toBe('Charlie');

      // findOne
      const admin = collection.findOne({ role: 'admin' });
      expect(admin?.name).toBe('Alice');
    });

    it('sorts records ascending and descending', () => {
      collection.insertMany([
        { id: 'u1', name: 'Charlie', age: 35, role: 'user' },
        { id: 'u2', name: 'Alice', age: 30, role: 'admin' },
        { id: 'u3', name: 'Bob', age: 25, role: 'user' },
      ]);

      const sortedAgeAsc = collection.find(undefined, {
        sort: { field: 'age', order: 'asc' },
      });
      expect(sortedAgeAsc.map(u => u.age)).toEqual([25, 30, 35]);

      const sortedAgeDesc = collection.find(undefined, {
        sort: { field: 'age', order: 'desc' },
      });
      expect(sortedAgeDesc.map(u => u.age)).toEqual([35, 30, 25]);
    });

    it('paginates results using limit and skip', () => {
      collection.insertMany([
        { id: 'u1', name: 'Alice', age: 20, role: 'user' },
        { id: 'u2', name: 'Bob', age: 25, role: 'user' },
        { id: 'u3', name: 'Charlie', age: 30, role: 'user' },
        { id: 'u4', name: 'Dave', age: 35, role: 'user' },
      ]);

      const page1 = collection.find(undefined, {
        sort: { field: 'age', order: 'asc' },
        limit: 2,
        skip: 0,
      });
      expect(page1.map(u => u.name)).toEqual(['Alice', 'Bob']);

      const page2 = collection.find(undefined, {
        sort: { field: 'age', order: 'asc' },
        limit: 2,
        skip: 2,
      });
      expect(page2.map(u => u.name)).toEqual(['Charlie', 'Dave']);
    });

    it('deletes records by ID and by predicate', () => {
      collection.insertMany([
        { id: 'u1', name: 'Alice', age: 20, role: 'admin' },
        { id: 'u2', name: 'Bob', age: 25, role: 'user' },
        { id: 'u3', name: 'Charlie', age: 30, role: 'user' },
      ]);

      expect(collection.delete('u1')).toBe(true);
      expect(collection.findById('u1')).toBeNull();
      expect(collection.count()).toBe(2);

      const deletedCount = collection.deleteMany(u => u.role === 'user');
      expect(deletedCount).toBe(2);
      expect(collection.count()).toBe(0);
    });

    it('executes atomic batch operations', () => {
      collection.insert({ id: 'u1', name: 'Original', age: 20, role: 'user' });

      collection.batch([
        { type: 'insert', record: { id: 'u2', name: 'Inserted', age: 25, role: 'user' } },
        { type: 'update', id: 'u1', patch: { name: 'Modified' } },
        { type: 'upsert', record: { id: 'u3', name: 'Upserted', age: 30, role: 'user' } },
      ]);

      expect(collection.count()).toBe(3);
      expect(collection.findById('u1')?.name).toBe('Modified');
      expect(collection.findById('u2')?.name).toBe('Inserted');
      expect(collection.findById('u3')?.name).toBe('Upserted');
    });

    it('notifies subscribers on mutations', () => {
      const listener = jest.fn();
      const unsubscribe = collection.subscribe(listener);

      collection.insert({ id: 'u1', name: 'Alice', age: 30, role: 'admin' });
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'insert',
          collectionName: 'test_users',
          recordIds: ['u1'],
        })
      );

      collection.update('u1', { age: 31 });
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'update',
          collectionName: 'test_users',
          recordIds: ['u1'],
        })
      );

      unsubscribe();
      collection.delete('u1');
      // Should not be called after unsubscribe
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('Migrations and Snapshots', () => {
    it('runs schema migrations in sequential order', async () => {
      const db = localDatabase;
      db.setSchemaVersion(0);

      const migrationLog: number[] = [];
      db.registerMigration(1, async () => {
        migrationLog.push(1);
      });
      db.registerMigration(2, async () => {
        migrationLog.push(2);
      });

      const finalVersion = await db.runMigrations();
      expect(finalVersion).toBe(2);
      expect(migrationLog).toEqual([1, 2]);
      expect(db.getSchemaVersion()).toBe(2);
    });

    it('exports and imports database data snapshots', () => {
      const col = localDatabase.collection<{ id: string; title: string }>('items');
      col.insert({ id: 'i1', title: 'Item 1' });
      col.insert({ id: 'i2', title: 'Item 2' });

      const exported = localDatabase.exportData();
      expect(exported.items).toHaveLength(2);

      localDatabase.clearAll();
      expect(localDatabase.collection('items').count()).toBe(0);

      localDatabase.importData(exported);
      expect(localDatabase.collection('items').count()).toBe(2);
    });
  });
});
