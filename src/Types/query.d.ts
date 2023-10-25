type AdQuery = {
  isAdvanced?: boolean;
  filters: QueryFilter[];
  servers: string[];
};

type QueryFilter = {
  property: string;
  value: string;
};

type AzureQuery = {
  searchString: string;
};