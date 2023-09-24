type Loadable<T> = null | {
  result?: T;
  error?: string;
};

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | Array<JSONValue>;

type PSResult = {
  __id__: number;
  [key: string]: JSONValue;
}[];

type InvokePSCommandRequest = {
  useGlobalSession: boolean;
  command: string;
  fields: string[];
};
