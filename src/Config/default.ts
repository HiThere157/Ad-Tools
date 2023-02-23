const dnsTypes: string[] = ["A_AAAA", "NS", "PTR", "MX", "ALL"];

const columns: { [key: string]: ColumnDefinition[] } = {
  attribute: [
    { title: "Key", key: "key" },
    { title: "Value", key: "value" },
  ],

  // AD Columns
  member: [
    { title: "Name", key: "Name" },
    { title: "Type", key: "ObjectClass" },
  ],
  membership: [{ title: "Name", key: "Name" }],
  user: [
    { title: "Name", key: "Name" },
    { title: "Display Name", key: "DisplayName" },
    { title: "Department", key: "Department" },
  ],
  group: [
    { title: "Name", key: "Name" },
    { title: "Description", key: "Description" },
  ],
  computer: [
    { title: "Name", key: "Name" },
    { title: "Device OS", key: "OperatingSystem" },
  ],

  // WMI Columns
  monitor: [
    { title: "Name", key: "UserFriendlyName" },
    { title: "Serial Number", key: "SerialNumberID" },
    { title: "Production year", key: "YearOfManufacture" },
  ],
  software: [
    { title: "Name", key: "Name" },
    { title: "Vendor", key: "Vendor" },
    { title: "Version", key: "Version" },
    { title: "ID", key: "IdentifyingNumber" },
  ],

  // General Columns
  printer: [
    { title: "Name", key: "Name" },
    { title: "Location", key: "Location" },
    { title: "Status", key: "__friendlyStatus__" },
    { title: "Comment", key: "Comment" },
    { title: "Job Count", key: "JobCount" },
    { title: "Driver Name", key: "DriverName" },
  ],

  // AAD Columns
  azureUser: [
    { title: "User Principal Name", key: "UserPrincipalName" },
    { title: "Display Name", key: "DisplayName" },
    { title: "Department", key: "Department" },
  ],
  azureGroup: [
    { title: "Display Name", key: "DisplayName" },
    { title: "Description", key: "Description" },
  ],
  azureDevice: [
    { title: "Display Name", key: "DisplayName" },
    { title: "Device OS", key: "DeviceOSType" },
    { title: "Enabled", key: "AccountEnabled" },
    { title: "MDM", key: "IsManaged" },
    {
      title: "Last Logon",
      key: "ApproximateLastLogonTimeStamp",
    },
  ],

  dns: [
    { title: "Name", key: "Name" },
    { title: "Type", key: "__friendlyType__" },
    { title: "Result", key: "__result__" },
    { title: "Connection", key: "__connection__" },
  ],
  history: [
    { title: "Command", key: "command" },
    { title: "Arguments", key: "args" },
    { title: "Date", key: "date" },
    { title: "Success", key: "success" },
  ],
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

export { dnsTypes, columns, commandDBConfig };
