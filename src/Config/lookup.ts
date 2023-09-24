export const friendlyNames: PartialRecord<string, string> = {
  username: "Username",
  attrib1: "Attribute 1",
  attrib2: "Attribute 2",
  numeric: "Numeric",
  numeric2: "Numeric 2",
};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
