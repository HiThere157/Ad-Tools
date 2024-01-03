type RawResultObject = {
  [key: string]: any;
};
type ResultObject = RawResultObject & {
  __id__: number;
  __highlight_bg__?: string;
  __highlight_fg__?: string;
};
type ResultDataSet =
  | null
  | undefined
  | {
      result?: {
        data: ResultObject[];
        columns: string[];
      };
      error?: string;
      timestamp?: number;
      executionTime?: number;
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
type AzureEnvironment = {
  executingAzureUser: string;
};
type PowershellEnvironment = {
  adVersion: string | null;
  azureAdVersion: string | null;
};

type WindowState = "minimize" | "maximize_restore" | "close";

type UpdateDownloadStatus = null | {
  status: "pending" | "complete" | "error" | "upToDate";
  version: string;
};
