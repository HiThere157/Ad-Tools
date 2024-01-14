export enum Pages {
  AdUser = "adUser",
  AdGroup = "adGroup",
  AdComputer = "adComputer",
  AdReplication = "adReplication",
  Wmi = "wmi",
  Printers = "printers",
  AzureUser = "azureUser",
  AzureGroup = "azureGroup",
  AzureDevice = "azureDevice",
  History = "history",
}

export enum AdUserTables {
  Search = "search",
  Attributes = "attributes",
  Memberof = "memberof",
}

export enum AdGroupTables {
  Search = "search",
  Attributes = "attributes",
  Members = "members",
  Memberof = "memberof",
}

export enum AdComputerTables {
  Search = "search",
  Dns = "dns",
  Attributes = "attributes",
  Memberof = "memberof",
}

export enum AdReplicationTables {
  Search = "search",
  Attributes = "attributes",
}

export enum WmiTables {
  Search = "search",
  Monitors = "monitors",
  Sysinfo = "sysinfo",
  Software = "software",
  Bios = "bios",
}

export enum PrintersTables {
  Search = "search",
  Printers = "printers",
}

export enum AzureUserTables {
  Search = "search",
  Attributes = "attributes",
  Memberof = "memberof",
  Devices = "devices",
}

export enum AzureGroupTables {
  Search = "search",
  Attributes = "attributes",
  Members = "members",
}

export enum AzureDeviceTables {
  Search = "search",
  Attributes = "attributes",
}

export enum HistoryTables {
  QueryLog = "queryLog",
}
