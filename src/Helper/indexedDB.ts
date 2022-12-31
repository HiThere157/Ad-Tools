class Store {
  constructor(
    private db: Promise<IDBDatabase> | IDBDatabase,
    private store: string,
    private mode: IDBTransactionMode,
  ) {}

  async getStore() {
    return (await this.db).transaction(this.store, this.mode).objectStore(this.store);
  }

  handleRequest(request: IDBRequest, onsuccess: Function, onerror: Function) {
    request.onsuccess = (event: any) => {
      onsuccess(event.target);
    };
    request.onerror = (event: any) => {
      onerror(event.target.error.name);
    };
  }

  async add(item: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await this.getStore();
        this.handleRequest(store.add(item), resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAll<T>(): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await this.getStore();
        this.handleRequest(
          store.getAll(),
          (target: any) => {
            resolve(target.result as T[]);
          },
          reject,
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteOld(n: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.getAll<{ id: number }>();

        const deleteCount = result.length - n;
        if (deleteCount <= 0) return;

        const store = await this.getStore();
        this.handleRequest(
          store.delete(IDBKeyRange.bound(0, result[deleteCount - 1].id)),
          resolve,
          reject,
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await this.getStore();
        this.handleRequest(store.clear(), resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

function setupIndexedDB(config: IndexedDBConfig) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    try {
      const openRequest = indexedDB.open(config.database, config.version);

      openRequest.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;

        config.stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, store.id);
          }
        });
      };

      openRequest.onerror = (event: any) => {
        reject(event.target.error.name);
      };

      openRequest.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
    } catch (error) {
      reject(error);
    }
  });
}

export { setupIndexedDB, Store };
