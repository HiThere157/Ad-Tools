export const defaultTab: Tab = {
  id: 0,
  title: "New Tab",
};

export const defaultQueryFilter: QueryFilter = {
  property: "",
  value: "",
};

export const defaultQuery: Query = {
  isAdvanced: false,
  filters: [
    {
      property: "Name",
      value: "",
    },
  ],
  servers: [],
};

export const defaultTableFilter: TableFilter = {
  type: "is",
  column: "",
  value: "",
};

export const defaultTableHighlight: TableHighlight = {
  color: "#000000",
  type: "bg",
  strings: [],
};

export const defaultTableColumn: TableColumn = {
  name: "",
  label: "",
};

export const defaultTableConfig: TableConfig = {
  isFilterOpen: false,
  isHighlightOpen: false,
  isColumnsOpen: false,
  isCollapsed: false,
  filters: [],
  sort: {
    column: "__id__",
    direction: "asc",
  },
  selected: [],
  pageIndex: 0,
};

export const defaultTablePreferences: TablePreferences = {
  pageSize: 10,
  highlights: [],
  savedFilters: [],
  savedFilterName: undefined,
  columns: [],
};

export const defaultGlobalTablePreferences: PageStorage<PartialRecord<string, TablePreferences>> = {
  adUser: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    attributes: {
      pageSize: -1,
      highlights: [
        {
          color: "#ff0000",
          type: "fg",
          strings: ["Enabled,false", "isDeleted,true", "LockedOut,true", "PasswordExpired,true"],
        },
      ],
      savedFilters: [
        {
          name: "Login",
          filters: [
            {
              column: "key",
              type: "in",
              value: ["Enabled", "isDeleted", "LockedOut", "PasswordExpired", "PasswordLastSet"],
            },
          ],
        },
      ],
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    memberof: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  adGroup: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Description", label: "Description" },
        { name: "_Server", label: "Server" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    members: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "SamAccountName", label: "Sam Account Name" },
        { name: "DistinguishedName", label: "Distinguished Name" },
        { name: "ObjectClass", label: "Object Class" },
      ],
    },
    memberof: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  adComputer: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    dns: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Type", label: "Type" },
        { name: "IPAddress", label: "IP Address" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    memberof: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  adReplication: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "LastOriginatingChangeTime", label: "Timestamp" },
        { name: "AttributeName", label: "Attribute Name" },
        { name: "AttributeValue", label: "Attribute Value" },
      ],
    },
  },
  wmi: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    monitors: {
      ...defaultTablePreferences,
      columns: [
        { name: "UserFriendlyName", label: "User Friendly Name" },
        { name: "SerialNumberID", label: "Serial Number" },
        { name: "YearOfManufacture", label: "Year of Manufacture" },
      ],
    },
    sysinfo: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    software: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Vendor", label: "Vendor" },
        { name: "Version", label: "Version" },
        { name: "InstallDate", label: "Install Date" },
      ],
    },
    bios: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Manufacturer", label: "Manufacturer" },
        { name: "Version", label: "Version" },
        { name: "ReleaseDate", label: "Release Date" },
      ],
    },
  },
  printers: {
    printers: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Location", label: "Location" },
        { name: "Status", label: "Status" },
        { name: "Comment", label: "Comment" },
        { name: "JobCount", label: "Job Count" },
        { name: "DriverName", label: "Driver Name" },
      ],
    },
  },
  azureUser: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "UserPrincipalName", label: "User Principal Name" },
        { name: "Department", label: "Department" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    memberof: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "Description", label: "Description" },
      ],
    },
    devices: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "DeviceOSType", label: "OS Type" },
        { name: "AccountEnabled", label: "Account Enabled" },
        { name: "IsManaged", label: "Managed" },
        { name: "ApproximateLastLogonTimeStamp", label: "Last Logon" },
      ],
    },
  },
  azureGroup: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "Description", label: "Description" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    members: {
      ...defaultTablePreferences,
      columns: [
        { name: "UserPrincipalName", label: "User Principal Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "ObjectType", label: "Object Type" },
      ],
    },
  },
  azureDevice: {
    search: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "DeviceOSType", label: "OS Type" },
        { name: "AccountEnabled", label: "Account Enabled" },
        { name: "IsManaged", label: "Managed" },
        { name: "ApproximateLastLogonTimeStamp", label: "Last Logon" },
      ],
    },
    attributes: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
  },
  history: {
    queryLog: {
      ...defaultTablePreferences,
      columns: [
        { name: "command", label: "Command" },
        { name: "timestamp", label: "Timestamp" },
        { name: "executionTime", label: "Execution Time" },
        { name: "success", label: "Success" },
      ],
    },
  },
};
