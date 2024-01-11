type Query = {
  isAdvanced?: boolean;
  filters: QueryFilter[];
  servers: string[];
};

type QueryFilter = {
  property: string;
  value: string;
};

type QueryLog = {
  command: string;
  timestamp: string;
  executionTime: string;
  success: boolean;
};
