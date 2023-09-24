type Loadable<T> = null | {
  result?: T;
  error?: string;
};

type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | Array<JSONValue>;
type PSResult = {
  __id__: number;
  [key: string]: JSONValue | undefined;
}[];
type PSDataSet = {
  timestamp?: number;
  executionTime?: number;
  data: Loadable<PSResult>;
  columns: string[];
};

type InvokePSCommandRequest = {
  useGlobalSession: boolean;
  command: string;
  fields: string[];
};
