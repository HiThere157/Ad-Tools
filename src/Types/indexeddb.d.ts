type IndexedDBConfig = {
  database: string;
  version: number;
  stores: IndexedDBStore[];
};

type IndexedDBStore = {
  name: string;
  id: IDBObjectStoreParameters;
};
