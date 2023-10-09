export const friendlyNames: PartialRecord<string, string> = {
  key: "Key",
  value: "Value",
  DistinguishedName: "Distinguished Name",
  SamAccountName: "SAM Account Name",
  UserPrincipalName: "User Principal Name",
  GroupCategory: "Group Category",
};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
