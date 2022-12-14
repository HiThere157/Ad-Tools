type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI:
      | {
          getExecutingUser: () => Promise<Result<string>>;
          getDomainSuffixList: () => Promise<Result<PSResult>>;
          getVersion: () => Promise<Result<string>>;

          executeCommand: <T>(request: {
            command: Commands;
            args: CommandArgs;
            selectFields: string[];
            useStaticSession: boolean;
            json: boolean;
          }) => Promise<Result<T>>;
          startComputerAction: (
            action: ComputerAction,
            target: string,
            useCurrentUser: boolean,
          ) => Promise<Result<string>>;
          authAzureAD: (tenant?: string, useCredentials: boolean) => Promise<Result<string>>;
          probeConnection: (target: string) => Promise<Result<string>>;

          changeWinState: (state: WinState) => void;
          handleZoomUpdate: (callback: Function) => void;
          removeZoomListener: () => void;
        }
      | undefined;
  };

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

type AdQuery = {
  input?: string;
  domain?: string;
};
type AadQuery = {
  input?: string;
  tenant?: string;
  useCredentials?: boolean;
};
type DnsQuery = {
  input?: string;
  type?: string;
};

type PSResult = { [key: string]: string | number | string[] | number[] };
type Result<T> = {
  output?: T;
  error?: string;
};
