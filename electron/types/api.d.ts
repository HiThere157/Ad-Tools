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
  __highlight_bg__?: string;
  __highlight_fg__?: string;
};
type PSDataSet = {
  data: PSResult[];
  columns: string[];
};

type ElectronEnvironment = {
  executingUser: string;
  appVersion: string;
  appChannel: "beta" | "stable";
};

type InvokePSCommandRequest = {
  command: string;
  selectFields?: string[];
  useGlobalSession?: boolean;
};

type WindowState = "minimize" | "maximize_restore" | "close";
