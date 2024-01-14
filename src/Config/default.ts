import {
  AdComputerTables,
  AdGroupTables,
  AdReplicationTables,
  AdUserTables,
  AzureDeviceTables,
  AzureGroupTables,
  AzureUserTables,
  HistoryTables,
  Pages,
  PrintersTables,
  WmiTables,
} from "./const";

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

export const defaultGlobalTablePreferences: PartialRecord<
  string,
  PartialRecord<string, TablePreferences>
> = {
  [Pages.AdUser]: {
    [AdUserTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    [AdUserTables.Attributes]: {
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
    [AdUserTables.Memberof]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  [Pages.AdGroup]: {
    [AdGroupTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Description", label: "Description" },
        { name: "_Server", label: "Server" },
      ],
    },
    [AdGroupTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    [AdGroupTables.Members]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "SamAccountName", label: "Sam Account Name" },
        { name: "DistinguishedName", label: "Distinguished Name" },
        { name: "ObjectClass", label: "Object Class" },
      ],
    },
    [AdGroupTables.Memberof]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  [Pages.AdComputer]: {
    [AdComputerTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    [AdComputerTables.Dns]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Type", label: "Type" },
        { name: "IPAddress", label: "IP Address" },
      ],
    },
    [AdComputerTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    [AdComputerTables.Memberof]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "GroupCategory", label: "Category" },
        { name: "DistinguishedName", label: "Distinguished Name" },
      ],
    },
  },
  [Pages.AdReplication]: {
    [AdReplicationTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    [AdReplicationTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "LastOriginatingChangeTime", label: "Timestamp" },
        { name: "AttributeName", label: "Attribute Name" },
        { name: "AttributeValue", label: "Attribute Value" },
      ],
    },
  },
  [Pages.Wmi]: {
    [WmiTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "_Server", label: "Server" },
      ],
    },
    [WmiTables.Monitors]: {
      ...defaultTablePreferences,
      columns: [
        { name: "UserFriendlyName", label: "User Friendly Name" },
        { name: "SerialNumberID", label: "Serial Number" },
        { name: "YearOfManufacture", label: "Year of Manufacture" },
      ],
    },
    [WmiTables.Sysinfo]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    [WmiTables.Software]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Vendor", label: "Vendor" },
        { name: "Version", label: "Version" },
        { name: "InstallDate", label: "Install Date" },
      ],
    },
    [WmiTables.Bios]: {
      ...defaultTablePreferences,
      columns: [
        { name: "Name", label: "Name" },
        { name: "Manufacturer", label: "Manufacturer" },
        { name: "Version", label: "Version" },
        { name: "ReleaseDate", label: "Release Date" },
      ],
    },
  },
  [Pages.Printers]: {
    [PrintersTables.Printers]: {
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
  [Pages.AzureUser]: {
    [AzureUserTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "UserPrincipalName", label: "User Principal Name" },
        { name: "Department", label: "Department" },
      ],
    },
    [AzureUserTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    [AzureUserTables.Memberof]: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "Description", label: "Description" },
      ],
    },
    [AzureUserTables.Devices]: {
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
  [Pages.AzureGroup]: {
    [AzureGroupTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "Description", label: "Description" },
      ],
    },
    [AzureGroupTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
    [AzureGroupTables.Members]: {
      ...defaultTablePreferences,
      columns: [
        { name: "UserPrincipalName", label: "User Principal Name" },
        { name: "DisplayName", label: "Display Name" },
        { name: "ObjectType", label: "Object Type" },
      ],
    },
  },
  [Pages.AzureDevice]: {
    [AzureDeviceTables.Search]: {
      ...defaultTablePreferences,
      columns: [
        { name: "DisplayName", label: "Display Name" },
        { name: "DeviceOSType", label: "OS Type" },
        { name: "AccountEnabled", label: "Account Enabled" },
        { name: "IsManaged", label: "Managed" },
        { name: "ApproximateLastLogonTimeStamp", label: "Last Logon" },
      ],
    },
    [AzureDeviceTables.Attributes]: {
      ...defaultTablePreferences,
      columns: [
        { name: "key", label: "Key" },
        { name: "value", label: "Value" },
      ],
    },
  },
  [Pages.History]: {
    [HistoryTables.QueryLog]: {
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
