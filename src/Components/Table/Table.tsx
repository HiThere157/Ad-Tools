import { useState } from "react";
import { tableConfig } from "../../Config/default";

import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TableFilterMenu from "./TableFilterMenu";
import TableElement from "./TableElement";

type TableProps = {
  dataSet: DataSet<Loadable<PSResult>>;
  config: TableConfig;
  setConfig: (config: TableConfig) => void;
};
export default function Table({ dataSet, config, setConfig }: TableProps) {
  const { timestamp, title, data, columns } = dataSet;
  const { isCollapsed, filters, hiddenColumns, sort, selected } = config;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="flex w-fit min-w-[35rem] flex-col gap-1">
      <div className="ms-1 flex items-center justify-between">
        <TableHeader
          title={title}
          resultCount={10}
          isCollapsed={isCollapsed ?? false}
          setIsCollapsed={(isCollapsed) => setConfig({ ...config, isCollapsed })}
        />
        <TableActions
          onReset={() => setConfig(tableConfig)}
          onFilterMenu={() => setIsFilterOpen(!isFilterOpen)}
          columns={columns}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={(hiddenColumns) => setConfig({ ...config, hiddenColumns })}
        />
      </div>

      {isFilterOpen && (
        <TableFilterMenu
          columns={columns}
          filters={filters}
          setFilters={(filters) => setConfig({ ...config, filters })}
        />
      )}

      {!isCollapsed && (
        <TableElement
          data={data?.result ?? []}
          columns={columns.filter((column) => !hiddenColumns.includes(column))}
          filters={filters}
          sort={sort}
          setSort={(sort) => setConfig({ ...config, sort })}
          selected={selected}
          setSelected={(selected) => setConfig({ ...config, selected })}
        />
      )}
    </section>
  );
}
