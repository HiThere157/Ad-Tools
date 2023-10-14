type SetQueryAction = {
  page: string;
  tabId: number;
  query: AdQuery;
};

type AdQuery = {
  isAdvanced: boolean;
  filter: PartialRecord<string, string>;
  servers: string[];
};
