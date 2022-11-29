export type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI: {
      getExecutingUser: () => { output: string };
      executeCommand: (request: {
        command: Commands;
        args: CommandArgs;
        selectFields: string[];
        useStaticSession: boolean;
        json: boolean;
      }) => Promise<ResultData>;
      startComputerAction: (
        action: ComputerAction,
        target: string
      ) => Promise<ResultData>;
      probeConnection: (target: string) => ResultData;
      handleZoomUpdate: (callback: Function) => void;
      removeZoomListener: () => void;
    };
  };

export type Command =
  | "Get-ADObject"
  | "Get-ADUser"
  | "Get-ADGroup"
  | "Get-ADGroupMember"
  | "Get-ADComputer"
  | "Get-CimInstance"
  | "Get-WmiObject"
  | "Resolve-DnsName"
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

export type ResultData = {
  output?: { [key: string]: any }[];
  error?: string;
};
