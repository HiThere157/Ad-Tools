export type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI:
      | {
          getExecutingUser: () => Promise<ResultDataString>;
          getDomainSuffixList: () => Promise<ResultData>;
          getVersion: () => Promise<{ output: string }>;
          executeCommand: (request: {
            command: Commands;
            args: CommandArgs;
            selectFields: string[];
            useStaticSession: boolean;
            json: boolean;
          }) => Promise<ResultData | ResultDataString>;
          startComputerAction: (
            action: ComputerAction,
            target: string,
            useCurrentUser: boolean,
          ) => Promise<ResultDataString>;
          probeConnection: (target: string) => Promise<{ output: string }>;
          changeWinState: (state: WinState) => void;
          handleZoomUpdate: (callback: Function) => void;
          removeZoomListener: () => void;
        }
      | undefined;
  };

export type Command =
  | "Get-ADUser"
  | "Get-ADGroup"
  | "Get-ADGroupMember"
  | "Get-ADComputer"
  | "Get-WmiObject"
  | "Resolve-DnsName"
  | "Get-Printer"
  | "Clear-DnsClientCache"
  | "Connect-AzureAD"
  | "Get-AzureADCurrentSessionInfo"
  | "Get-AzureADUser"
  | "Get-AzureADUserMembership"
  | "Get-AzureADUserRegisteredDevice"
  | "Get-AzureADGroup"
  | "Get-AzureADGroupMember"
  | "Get-AzureADDevice";

export type CommandArgs = {
  Filter?: string;
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
  ClassName?: string;
  Namespace?: string;
  ComputerName?: string;
  Type?: string;
  Tenant?: string;
  ObjectId?: string;
  SearchString?: string;
  All?: string;
};

type ComputerAction = "compmgmt" | "mstsc" | "powershell";

type WinState = "minimize" | "maximize_restore" | "quit";

export type AdQuery = {
  input?: string;
  domain?: string;
};
export type AadQuery = {
  input?: string;
  tenant?: string;
};
export type DnsQuery = {
  input?: string;
  type?: string;
};

export type Entry = { [key: string]: any };
export type ResultData = {
  output?: Entry[];
  error?: string;
};
export type ResultDataString = {
  output?: string;
  error?: string;
};
