const dnsTypes: string[] = ["A_AAAA", "NS", "PTR", "MX", "ALL"];

const columns: { [key: string]: ColumnDefinition[] } = {
  attribute: [
    { title: "Key", key: "key" },
    { title: "Value", key: "value" },
  ],
  default: [
    { title: "Name", key: "Name" },
    { title: "Distinguished Name", key: "DistinguishedName" },
  ],
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
  printer: [
    { title: "Name", key: "Name" },
    { title: "Location", key: "Location" },
    { title: "Status", key: "__friendlyStatus__" },
    { title: "Comment", key: "Comment" },
    { title: "Job Count", key: "JobCount" },
    { title: "Driver Name", key: "DriverName" },
  ],
  extended: [
    { title: "Name", key: "Name" },
    { title: "Type", key: "ObjectClass" },
    { title: "Distinguished Name", key: "DistinguishedName" },
  ],
  azureGroup: [
    { title: "Display Name", key: "DisplayName" },
    { title: "Description", key: "Description" },
  ],
  azureUser: [
    { title: "User Principal Name", key: "UserPrincipalName" },
    { title: "Display Name", key: "DisplayName" },
    { title: "Department", key: "Department" },
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
