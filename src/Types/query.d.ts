type AdQuery = {
  isAdvanced: boolean;
  filter: PartialRecord<string, string>;
  servers: string[];
};
type AadQuery = {
  searchString: string;
};
type DnsQuery = {
  target: string;
  filter: string;
};
