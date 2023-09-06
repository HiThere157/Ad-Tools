type DataSet<T> = {
  key: string;
  timestamp: string;
  title: string;
  data: T;
  columns: string[];
};
