export const friendlyNames: PartialRecord<string, string> = {
  // Attributes
  key: "Key",
  value: "Value",

  // Ad/Azure Objects
  DisplayName: "Display Name",
  DistinguishedName: "Distinguished Name",
  UserPrincipalName: "User Principal Name",
  SamAccountName: "SAM Account Name",
  GroupCategory: "Group Category",
  ObjectClass: "Object Class",
  ObjectId: "Object ID",
  ObjectType: "Object Type",
  AttributeName: "Attribute Name",
  AttributeValue: "Attribute Value",
  LastOriginatingChangeTime: "Timestamp",
  DeviceOSType: "Device OS Type",
  AccountEnabled: "Account Enabled",
  IsManaged: "Is Managed",
  ApproximateLastLogonTimestamp: "Last Logon",
  _Server: "Server",

  // Dns
  IPAddress: "IP Address",

  // Printer
  JobCount: "Job Count",
  DriverName: "Driver Name",

  // WMI
  UserFriendlyName: "User Friendly Name",
  SerialNumberID: "Serial Number ID",
  YearOfManufacture: "Year of Manufacture",
  InstallDate: "Install Date",
  ReleaseDate: "Release Date",

  // History
  command: "Command",
  timestamp: "Timestamp",
  executionTime: "Execution Time",
  success: "Success",
};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
