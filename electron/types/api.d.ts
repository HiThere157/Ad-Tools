type Loadable<T> = null | {
  result?: T;
  error?: string;
};

type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | Array<JSONValue>;
type RawPSResult = {
  [key: string]: JSONValue | undefined;
};
type PSResult = RawPSResult & {
  __id__: number;
};
type PSDataSet = {
  timestamp: number;
  executionTime: number;
  data: PSResult[];
  columns: string[];
};

type InvokePSCommandRequest = {
  useGlobalSession: boolean;
  command: string;
  fields: string[];
};
