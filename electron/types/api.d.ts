type Loadable<T> = null | {
  result?: T;
  error?: string;
  timestamp: number;
  executionTime: number;
};

type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | Array<JSONValue>;
type RawPSResult = {
  [key: string]: JSONValue | undefined;
};
type PSResult = RawPSResult & {
  __id__: number;
};
type PSDataSet = {
  data: PSResult[];
  columns: string[];
};

type InvokePSCommandRequest = {
  command: string;
  fields?: string[];
  useGlobalSession?: boolean;
};
