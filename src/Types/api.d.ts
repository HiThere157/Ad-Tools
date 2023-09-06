type Loadable<T> = null | {
  data?: T;
  error?: string;
};

type PSResult = {
  __id__: number;
  [key: string]: JSONValue;
}[];

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | Array<JSONValue>;

type AdQuery = {
  filter?: Record<string, string | undefined>;
  server?: string;
};
type AadQuery = {
  searchString?: string;
};
type DnsQuery = {
  target?: string;
  filter?: string;
};
