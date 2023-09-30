export const friendlyNames: PartialRecord<string, string> = {};

export function friendly(text: string) {
  return friendlyNames[text] ?? text;
}
