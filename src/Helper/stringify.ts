export default function stringify(
  any: any,
  prettyJson: boolean = true
): string {
  const string = toStr(any, prettyJson);
  return string.replace(/\/Date\(([0-9]+)\)\//g, (matched) => {
    const timestamp = matched.substring(6, matched.length - 2);
    return new Date(Number(timestamp)).toLocaleTimeString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  });
}

function toStr(any: any, prettyJson: boolean = true): string {
  switch (typeof any) {
    case "object":
      return JSON.stringify(any, null, prettyJson ? 2 : 0);

    case "boolean":
      return any ? "True" : "False";

    case "undefined":
      return "";

    default:
      return any.toString();
  }
}
