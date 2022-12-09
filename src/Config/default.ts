type ColumnDefinition = {
  title: string;
  key: string;
  sortable: boolean;
};

const dnsTypes: string[] = ["A_AAAA", "NS", "PTR", "MX", "ALL"];

const columns: { [key: string]: ColumnDefinition[] } = {
  attribute: [
    { title: "Key", key: "key", sortable: true },
    { title: "Value", key: "value", sortable: true },
  ],
  default: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
  monitor: [
    { title: "Name", key: "UserFriendlyName", sortable: true },
    { title: "Serial Number", key: "SerialNumberID", sortable: true },
    { title: "Production year", key: "YearOfManufacture", sortable: true },
  ],
  software: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Vendor", key: "Vendor", sortable: true },
    { title: "Version", key: "Version", sortable: true },
    { title: "ID", key: "IdentifyingNumber", sortable: true },
  ],
  printer: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Location", key: "Location", sortable: true },
    { title: "Status", key: "__friendlyStatus__", sortable: true },
    { title: "Comment", key: "Comment", sortable: true },
    { title: "Job Count", key: "JobCount", sortable: true },
    { title: "Driver Name", key: "DriverName", sortable: true },
  ],
  extended: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Type", key: "ObjectClass", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
  azureGroup: [
    { title: "Display Name", key: "DisplayName", sortable: true },
    { title: "Description", key: "Description", sortable: true },
  ],
  azureUser: [
    { title: "User Principal Name", key: "UserPrincipalName", sortable: true },
    { title: "Display Name", key: "DisplayName", sortable: true },
    { title: "Department", key: "Department", sortable: true },
  ],
  azureDevice: [
    { title: "Display Name", key: "DisplayName", sortable: true },
    { title: "Device OS", key: "DeviceOSType", sortable: true },
    { title: "Enabled", key: "AccountEnabled", sortable: true },
    { title: "MDM", key: "IsManaged", sortable: true },
    {
      title: "Last Logon",
      key: "ApproximateLastLogonTimeStamp",
      sortable: true,
    },
  ],
  dns: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Type", key: "__friendlyType__", sortable: true },
    { title: "Result", key: "__result__", sortable: true },
    { title: "Connection", key: "__connection__", sortable: true },
  ],
  history: [
    { title: "Command", key: "command", sortable: true },
    { title: "Arguments", key: "args", sortable: true },
    { title: "Date", key: "date", sortable: true },
    { title: "Success", key: "success", sortable: true },
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
export type { ColumnDefinition };
