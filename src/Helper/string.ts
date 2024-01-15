export function stringify(any: any): string {
  if (any === undefined) return "undefined";
  if (any === null) return "null";

  if (typeof any === "object") {
    return resolveTimestamp(JSON.stringify(any, null, 2));
  }

  return resolveTimestamp(any.toString());
}

export function resolveTimestamp(string: string) {
  return string.replace(/\/Date\(([0-9]+)\)\//g, (matched) => {
    const timestamp = matched.substring(6, matched.length - 2);
    return new Date(Number(timestamp)).toISOString().replace("T", " ").replace("Z", " UTC");
  });
}

export function removeIndent(string: string) {
  return string.replace(/\n^ +/gm, " ");
}
