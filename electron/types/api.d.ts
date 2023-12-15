type Loadable<T> =
  | null
  | undefined
  | {
      result?: T;
      error?: string;
      timestamp: number;
      executionTime: number;
    };

type RawPSResult = {
  [key: string]: any;
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

type InvokePSCommandRequest = {
  command: string;
  selectFields?: string[];
};

type ElectronEnvironment = {
  executingUser: string;
  appVersion: string;
  appChannel: "beta" | "stable";
};

type WindowState = "minimize" | "maximize_restore" | "close";

type UpdateDownloadStatus = null | {
  status: "pending" | "complete" | "error";
  version: string;
};
