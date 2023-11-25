type Query = {
  isAdvanced?: boolean;
  filters: QueryFilter[];
  servers: string[];
};

type QueryFilter = {
  property: string;
  value: string;
};
