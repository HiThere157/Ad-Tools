import { useSessionStorage } from "../../Hooks/useStorage";
import { defaultTableConfig } from "../../Config/default";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";

type TableProps = {
  id: string;
  title: string;
  result: ApiResult<PSResult>;
};
export default function Table({ id, title, result }: TableProps) {
  const [config, setConfig] = useSessionStorage<TableConfig>(id, defaultTableConfig);

  return (
    <section>
      <TableHeader
        title={title}
        count={{
          total: result?.data?.length ?? 0,
          selected: 1,
          filtered: 2,
        }}
        isCollapsed={config.isCollapsed}
        setIsCollapsed={(isCollapsed) => setConfig({ ...config, isCollapsed })}
      />

      {!config.isCollapsed && (
        <Pagination
          total={result?.data?.length ?? 0}
          pagination={config.pagination}
          setPagination={(pagination) => setConfig({ ...config, pagination })}
        />
      )}
    </section>
  );
}
