type ColumnDefinition = {
  title: string;
  key: string;
  sortable: boolean;
};

const domains: string[] = ["Alcon.net", "Alconnet.com", "Itlab.local"];
const tenants: string[] = ["Alcon.net"];
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
  extended: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Type", key: "ObjectClass", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
  azureGroup: [
    { title: "Display Name", key: "DisplayName", sortable: true },
    { title: "Description", key: "Description", sortable: true },
    { title: "ObjectId", key: "ObjectId", sortable: true },
  ],
  azureUser: [
    { title: "User Principal Name", key: "UserPrincipalName", sortable: true },
    { title: "Display Name", key: "DisplayName", sortable: true },
    { title: "Department", key: "Department", sortable: true },
    { title: "ObjectId", key: "ObjectId", sortable: true },
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

export { domains, tenants, dnsTypes, columns, commandDBConfig };
export type { ColumnDefinition };
