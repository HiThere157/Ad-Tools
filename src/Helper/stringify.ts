export default function stringify(
  any: any,
  prettyJson: boolean = true
): string {
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
