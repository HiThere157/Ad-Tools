export function stringify(any: any): string {
  if (any === undefined) return "undefined";
  if (any === null) return "null";

  if (typeof any === "object") {
    return JSON.stringify(any);
  }

  return any.toString();
}
