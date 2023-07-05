type PaginationProps = {
  total: number;
  pagination: PaginationConfig;
  setPagination: (pagination: PaginationConfig) => void;
};
export default function Pagination({ total, pagination, setPagination }: PaginationProps) {
  return <div>Pagination</div>;
}
