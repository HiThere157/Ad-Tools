import TableElement from "./TableElement";
import TableHeader from "./TableHeader";

type TableProps = {
  dataSet: DataSet<Loadable<PSResult>>;
  config: TableConfig;
  setConfig: (newConfig: TableConfig) => void;
};
export default function Table({ dataSet, config, setConfig }: TableProps) {
  const { timestamp, title, data, columns } = dataSet;
  const { isCollapsed } = config;

  return (
    <section>
      <TableHeader
        title={title}
        resultCount={10}
        isCollapsed={isCollapsed ?? false}
        setIsCollapsed={(isCollapsed) => {
          setConfig({
            ...config,
            isCollapsed,
          });
        }}
      />

      <div className="w-fit">
        <TableElement data={data} columns={columns} />
      </div>
    </section>
  );
}
