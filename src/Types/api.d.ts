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
  | "Resolve-DnsName"
  | "Connect-AzureAD"
  | "Get-AzureADCurrentSessionInfo"
  | "Get-AzureADUser"
  | "Get-AzureADUserMembership"
  | "Get-AzureADGroup"
  | "Get-AzureADGroupMember";

export type CommandArgs = {
  Filter?: string;
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
  Type?: string;
  Tenant?: string;
  ObjectId?: string;
  SearchString?: string;
  All?: string;
};

export type ResultData = {
  output?: { [key: string]: any }[];
  error?: string;
};
