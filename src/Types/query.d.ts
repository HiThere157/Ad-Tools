type AdQuery = {
  filter: Record<string, string | undefined>;
  servers: string[];
};
type AadQuery = {
  searchString: string;
};
type DnsQuery = {
  target: string;
  filter: string;
};
