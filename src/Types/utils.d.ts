type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type PageStorage<T> = PartialRecord<string, T>;
type NameStorage<T> = PartialRecord<string, T>;
type TabStorage<T> = PageStorage<PartialRecord<number, T>>;
