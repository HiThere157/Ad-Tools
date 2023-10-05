export const friendlyNames: PartialRecord<string, string> = {
  key: "Key",
  value: "Value",
};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
