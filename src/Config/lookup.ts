export const friendlyNames: PartialRecord<string, string> = {
  // Attributes
  key: "Key",
  value: "Value",

  // Ad Objects
  DistinguishedName: "Distinguished Name",
  UserPrincipalName: "User Principal Name",
  SamAccountName: "SAM Account Name",
  GroupCategory: "Group Category",
  ObjectClass: "Object Class",
  _Server: "Server",

  // Dns
  IPAddress: "IP Address",
};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
