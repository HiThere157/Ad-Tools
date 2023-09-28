import { useState, useMemo, useEffect } from "react";

import { tableConfig } from "../../Config/default";
import { friendly } from "../../Config/lookup";
import { filterData, sortData, paginateData } from "../../Helper/array";
import { stringify } from "../../Helper/string";

import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TableFilterMenu from "./TableFilterMenu";
import TableElement from "./TableElement";
import TablePagination from "./TablePagination";

type TableProps = {
  title: string;
  dataSet?: Loadable<PSDataSet>;
  config: TableConfig;
  setConfig: (config: TableConfig) => void;
};
export default function Table({ dataSet, title, config, setConfig }: TableProps) {
  const { timestamp, executionTime, data = [], columns = [] } = dataSet?.result ?? {};
  const { isCollapsed, filters, hiddenColumns, sort, selected, pagination } = config;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [count, setCount] = useState<ResultCount>();

  const filteredResult = useMemo(() => {
    return filterData(data, filters);
  }, [data, filters]);

  const sortedResult = useMemo(() => {
    return sortData(filteredResult, sort);
  }, [filteredResult, sort]);

  const paginationResult = useMemo(() => {
    return paginateData(sortedResult, pagination);
  }, [sortedResult, pagination]);

  useEffect(() => {
    if (!dataSet?.result) return;

    setCount({
      total: data.length,
      filtered: data.length - filteredResult.length,
      selected: selected.length,
    });
  }, [data, filteredResult, selected]);

  const exportAsCSV = (onlySelection: boolean) => {
    // Add the header row to the CSV
    const csvColumns = columns.filter((column) => !hiddenColumns.includes(column));
    let csv = csvColumns.map(friendly).join("\u{9}") + "\n";

    data.forEach((entry) => {
      // Skip if not selected and onlySelection is true
      if (onlySelection && !selected.includes(entry.__id__)) return;

      // Add the row to the CSV
      csv += csvColumns.map((column) => stringify(entry[column])).join("\u{9}") + "\n";
    });

    navigator.clipboard.writeText(csv);
  };

  return (
    <section className="w-fit min-w-[35rem] max-w-full">
      <div className="ms-1 flex justify-between">
        <TableHeader
          title={title}
          count={count}
          isCollapsed={isCollapsed}
          setIsCollapsed={(isCollapsed) => setConfig({ ...config, isCollapsed })}
        />

        {count && count.total > 25 && !isCollapsed && (
          <TablePagination
            count={count.total - count.filtered}
            pagination={pagination}
            setPagination={(pagination) => setConfig({ ...config, pagination })}
          />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex gap-1">
          <TableActions
            onReset={() => setConfig(tableConfig)}
            onFilterMenu={() => setIsFilterOpen(!isFilterOpen)}
            onCopy={exportAsCSV}
            filters={filters}
            columns={columns}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={(hiddenColumns) => setConfig({ ...config, hiddenColumns })}
          />

          <div className="flex flex-grow min-w-0 flex-col gap-1">
            {isFilterOpen && (
              <TableFilterMenu
                columns={columns}
                filters={filters}
                setFilters={(filters) => setConfig({ ...config, filters })}
              />
            )}

            <TableElement
              data={paginationResult}
              columns={columns.filter((column) => !hiddenColumns.includes(column))}
              sort={sort}
              setSort={(sort) => setConfig({ ...config, sort })}
              allRowIds={data.map((row) => row.__id__) ?? []}
              selected={selected}
              setSelected={(selected) => setConfig({ ...config, selected })}
            />
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="ms-10 mt-1 flex justify-between">
          <div className="text-xs leading-[0.65rem] text-grey">
            {timestamp && executionTime && (
              <span>
                {new Date(timestamp).toLocaleTimeString("de-de")} - {executionTime}ms
              </span>
            )}
          </div>

          {count && count.total > 25 && (
            <TablePagination
              count={count.total - count.filtered}
              pagination={pagination}
              setPagination={(pagination) => setConfig({ ...config, pagination })}
            />
          )}
        </div>
      )}
    </section>
  );
}
