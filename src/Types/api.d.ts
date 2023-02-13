type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI:
      | {
          executeCommand: <T>(request: ExecuteCommandRequest) => Promise<Result<T>>;
          getExecutingUser: () => Promise<Result<string>>;
          getDomainSuffixList: () => Promise<Result<PSResult>>;
          startComputerAction: (options: StartComputerActionOptions) => Promise<Result<string>>;
          authAzureAD: (options: AuthAzureADOptions) => Promise<Result<string>>;

          probeConnection: (target: string) => Promise<Result<string>>;
          getVersion: () => Promise<Result<Version>>;

          changeWinState: (state: WinState) => void;
          handleZoomUpdate: (callback: (value: number) => void) => void;
          removeZoomListener: () => void;

          checkForUpdate: () => Promise<UpdateCheckResult>;
          handleDownloadStatusUpdate: (callback: (status: DownloadStatus) => void) => void;
          removeDownloadStatusUpdate: () => void;
        }
      | undefined;
  };

/** whitelist filters **/
type Command =
  | "Get-ADUser"
  | "Get-ADGroup"
  | "Get-ADGroupMember"
  | "Get-ADComputer"
  | "Get-WmiObject"
  | "Resolve-DnsName"
  | "Get-Printer"
  | "Clear-DnsClientCache"
  | "Disconnect-AzureAD"
  | "Get-AzureADCurrentSessionInfo"
  | "Get-AzureADUser"
  | "Get-AzureADUserMembership"
  | "Get-AzureADUserRegisteredDevice"
  | "Get-AzureADGroup"
  | "Get-AzureADGroupMember"
  | "Get-AzureADDevice";

type CommandArgs = {
  Filter?: string;
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
  ClassName?: string;
  Namespace?: string;
  ComputerName?: string;
  Type?: string;
  ObjectId?: string;
  SearchString?: string;
  All?: string;
};

type ComputerAction = "compmgmt" | "mstsc" | "powershell";

type WinState = "minimize" | "maximize_restore" | "quit";

type Version = {
  version: string;
  isBeta: boolean;
};

/** api parameter types **/
type ExecuteCommandRequest = {
  command: Commands;
  args: CommandArgs;
  selectFields: string[];
  useStaticSession: boolean;
  json: boolean;
};

type StartComputerActionOptions = {
  action: ComputerAction;
  target: string;
  useCurrentUser: boolean;
};

type AuthAzureADOptions = {
  accountId?: string;
  useCredentials: boolean;
};

/** api result types **/
type PSResult = { [key: string]: string | number | string[] | number[] };
type Result<T> = {
  output?: T;
  error?: string;
};

type UpdateCheckResult = {
  version?: string;
};
type DownloadStatus = "pending" | "complete" | "error";

/** query types **/
type AdQuery = {
  input?: string;
  domain?: string;
};
type AadQuery = {
  input?: string;
};
type DnsQuery = {
  input?: string;
  type?: string;
};
