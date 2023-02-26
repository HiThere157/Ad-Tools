const dnsTypes: string[] = ["A_AAAA", "NS", "PTR", "MX", "ALL"];

const columnNames: { [key: string]: string } = {
  key: "Key",
  value: "Value",

  DistinguishedName: "Distinguished Name",
  ObjectClass: "Type",
  DisplayName: "Display Name",
  OperatingSystem: "Operating System",

  UserFriendlyName: "Name",
  SerialNumberID: "Serial Number",
  YearOfManufacture: "Production Year",
  IdentifyingNumber: "ID",

  __friendlyStatus__: "Status",
  JobCount: "Job Count",
  DriverName: "Driver Name",

  UserPrincipalName: "User Principal Name",

  DeviceOSType: "Operating System",
  AccountEnabled: "Enabled",
  IsManaged: "MDM",
  ApproximateLastLogonTimeStamp: "Approximate Last Logon",

  __friendlyType__: "Type",
  __result__: "Result",
  __connection__: "Connection",

  command: "Command",
  args: "Arguments",
  date: "Date",
  success: "Success",
};

const columns: { [key: string]: string[] } = {
  attribute: ["key", "value"],

  // AD Columns
  member: ["Name", "ObjectClass"],
  limited: ["Name", "DistinguishedName"],
  user: ["Name", "DisplayName", "Department"],
  group: ["Name", "Description"],
  computer: ["Name", "OperatingSystem"],

  // WMI Columns
  monitor: ["UserFriendlyName", "SerialNumberID", "YearOfManufacture"],
  software: ["Name", "Vendor", "Version", "IdentifyingNumber"],

  // General Columns
  printer: ["Name", "Location", "__friendlyStatus__", "Comment", "JobCount", "DriverName"],

  // AAD Columns
  azureUser: ["UserPrincipalName", "DisplayName", "Department"],
  azureGroup: ["DisplayName", "Description"],
  azureDevice: [
    "DisplayName",
    "DeviceOSType",
    "AccountEnabled",
    "IsManaged",
    "ApproximateLastLogonTimeStamp",
  ],

  dns: ["Name", "__friendlyType__", "__result__", "__connection__"],
  history: ["command", "args", "date", "success"],
};

const commandDBConfig = {
  database: "history",
  version: 1,
  stores: [
    {
      name: "commands",
      id: {
        keyPath: "id",
        autoIncrement: true,
      },
    },
  ],
};

export { dnsTypes, columnNames, columns, commandDBConfig };
