import { createMMKV } from 'react-native-mmkv';
import { DatabaseCollection } from './collection';
import type { IDatabaseRecord } from './types';

export type MigrationFn = (db: LocalDatabase) => void | Promise<void>;

export class LocalDatabase {
  private static instance: LocalDatabase;
  private collections: Map<string, DatabaseCollection<any>> = new Map();
  private migrations: Map<number, MigrationFn> = new Map();
  private metaStorage: ReturnType<typeof createMMKV>;
  private readonly versionKey = '@superapp_db:schema_version';

  private constructor() {
    this.metaStorage = createMMKV({ id: 'superapp_db_metadata' });
  }

  public static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  /**
   * Retrieves or lazily creates a typed DatabaseCollection instance.
   */
  public collection<T extends IDatabaseRecord>(name: string): DatabaseCollection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new DatabaseCollection<T>(name));
    }
    return this.collections.get(name) as DatabaseCollection<T>;
  }

  /**
   * Checks if a collection has already been initialized in memory.
   */
  public hasCollection(name: string): boolean {
    return this.collections.has(name);
  }

  /**
   * Returns a list of all currently registered collection names.
   */
  public listCollections(): string[] {
    return Array.from(this.collections.keys());
  }

  /**
   * Retrieves the current schema version from database metadata.
   */
  public getSchemaVersion(): number {
    try {
      const v = this.metaStorage.getNumber(this.versionKey);
      return typeof v === 'number' ? v : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Updates the schema version.
   */
  public setSchemaVersion(version: number): void {
    try {
      this.metaStorage.set(this.versionKey, version);
    } catch {}
  }

  /**
   * Registers a database migration function for a specific schema version.
   */
  public registerMigration(version: number, migrationFn: MigrationFn): this {
    if (this.migrations.has(version)) {
      throw new Error(`Migration for version ${version} is already registered.`);
    }
    this.migrations.set(version, migrationFn);
    return this;
  }

  /**
   * Runs all pending migrations sequentially up to the latest registered version.
   */
  public async runMigrations(): Promise<number> {
    const currentVersion = this.getSchemaVersion();
    const targetVersions = Array.from(this.migrations.keys())
      .filter(v => v > currentVersion)
      .sort((a, b) => a - b);

    for (const v of targetVersions) {
      const migrationFn = this.migrations.get(v)!;
      await migrationFn(this);
      this.setSchemaVersion(v);
    }

    return this.getSchemaVersion();
  }

  /**
   * Clears all initialized collections in memory and on disk.
   */
  public clearAll(): void {
    this.collections.forEach(col => col.clear());
  }

  /**
   * Exports entire local database state as a JSON-serializable snapshot.
   */
  public exportData(): Record<string, any[]> {
    const snapshot: Record<string, any[]> = {};
    this.collections.forEach((col, name) => {
      snapshot[name] = col.getAll();
    });
    return snapshot;
  }

  /**
   * Imports a data snapshot, upserting all records into respective collections.
   */
  public importData(data: Record<string, any[]>): void {
    Object.entries(data).forEach(([colName, records]) => {
      if (Array.isArray(records)) {
        const col = this.collection(colName);
        col.upsertMany(records);
      }
    });
  }
}

export const localDatabase = LocalDatabase.getInstance();

