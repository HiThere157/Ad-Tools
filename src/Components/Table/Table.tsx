import { useMemo } from "react";

import { defaultTableConfig, defaultTablePreferences } from "../../Config/default";
import { filterData, sortData, paginateData, colorData } from "../../Helper/array";
import { stringify } from "../../Helper/string";

import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TableFilterMenu from "./TableFilterMenu";
import TableHighlightMenu from "./TableHighlightMenu";
import TableColumnMenu from "./TableColumnMenu";
import TableElement from "./TableElement";
import TablePagination from "./TablePagination";
import TableLoader from "./TableLoader";
import TableError from "./TableError";

type TableProps = {
  title: string;
  dataSet?: DataSet;
  tableState?: TableState;
  setTableState: (tableState: TableState) => void;
  isSearchTable?: boolean;
  redirectColumn?: string;
  onRedirect?: (row: ResultObject, newTab?: boolean) => void;
};
export default function Table({
  title,
  dataSet,
  tableState,
  setTableState,
  isSearchTable,
  redirectColumn,
  onRedirect,
}: TableProps) {
  const { data = [], error, timestamp, executionTime } = dataSet ?? {};
  const isLoading = dataSet === null;

  const { config = defaultTableConfig, preferences = defaultTablePreferences } = tableState ?? {};
  const { isFilterOpen, isHighlightOpen, isColumnsOpen } = config;
  const { isCollapsed, filters, sort, selected, pageIndex } = config;
  const { pageSize, highlights, savedFilters, savedFilterName, columns } = preferences;

  const updateTableConfig = (partialConfig: Partial<TableConfig>) =>
    setTableState({ preferences, config: { ...config, ...partialConfig } });

  const updateTablePreferences = (partialPreferences: Partial<TablePreferences>) =>
    setTableState({ config, preferences: { ...preferences, ...partialPreferences } });

  const selectedFilter = useMemo(
    () => savedFilters?.find((filter) => filter.name === savedFilterName)?.filters ?? filters,
    [savedFilters, savedFilterName, filters],
  );

  const filteredResult = useMemo(() => filterData(data, selectedFilter), [data, selectedFilter]);
  const sortedResult = useMemo(() => sortData(filteredResult, sort), [filteredResult, sort]);
  const paginationResult = useMemo(
    () => paginateData(sortedResult, pageIndex, pageSize),
    [sortedResult, pageIndex, pageSize],
  );
  const coloredResult = useMemo(
    () => colorData(paginationResult, highlights),
    [paginationResult, highlights],
  );

  const count: ResultCount | undefined = useMemo(() => {
    // Only show count if acutal data is available
    if (!data) return undefined;

    return {
      total: data.length,
      filtered: data.length - filteredResult.length,
      selected: selected.length,
    };
  }, [data, filteredResult, selected]);

  const exportAsCSV = (onlySelection: boolean) => {
    // Add the header row to the CSV
    const csvColumns = columns.filter(({ isHidden }) => !isHidden);
    let csv = csvColumns.map(({ label }) => label).join("\u{9}") + "\n";

    data.forEach((entry) => {
      // Skip if not selected and onlySelection is true
      if (onlySelection && !selected.includes(entry.__id__)) return;

      // Add the row to the CSV
      csv += csvColumns.map(({ name }) => stringify(entry[name])).join("\u{9}") + "\n";
    });

    navigator.clipboard.writeText(csv);
  };

  if (isSearchTable && dataSet === undefined) return null;

  return (
    <section className="relative mb-7 w-fit min-w-[35rem] max-w-full">
      {isSearchTable && (
        <div className="absolute -bottom-2 -left-2 top-0 w-2 rounded-l border-2 border-r-0 border-primaryAccent" />
      )}

      <div className="ms-0.5 flex justify-between">
        <TableHeader
          title={title}
          count={count}
          isCollapsed={isCollapsed}
          setIsCollapsed={(isCollapsed) => updateTableConfig({ isCollapsed })}
        />

        {count && count.total > 10 && !isCollapsed && (
          <TablePagination
            count={count.total - count.filtered}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={(pageIndex) => updateTableConfig({ pageIndex })}
            setPageSize={(pageSize) => updateTablePreferences({ pageSize })}
          />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex gap-1">
          <TableActions
            isFilterOpen={isFilterOpen}
            isHighlightOpen={isHighlightOpen}
            isColumnsOpen={isColumnsOpen}
            setFilterOpen={(isFilterOpen) => updateTableConfig({ isFilterOpen })}
            setHighlightOpen={(isHighlightOpen) => updateTableConfig({ isHighlightOpen })}
            setColumnsOpen={(isColumnsOpen) => updateTableConfig({ isColumnsOpen })}
            onCopy={exportAsCSV}
            filters={selectedFilter}
            highlights={highlights}
          />

          <div className="flex min-w-0 flex-grow flex-col gap-1">
            {isFilterOpen && (
              <TableFilterMenu
                columns={columns}
                filters={selectedFilter}
                setFilters={(filters) => updateTableConfig({ filters, pageIndex: 0 })}
                savedFilters={savedFilters}
                setSavedFilters={(savedFilters, savedFilterName) =>
                  updateTablePreferences({ savedFilters, savedFilterName })
                }
                savedFilterName={savedFilterName}
                setSavedFilterName={(savedFilterName) =>
                  updateTablePreferences({ savedFilterName })
                }
              />
            )}

            {isHighlightOpen && (
              <TableHighlightMenu
                highlights={highlights}
                setHighlights={(highlights) => updateTablePreferences({ highlights })}
              />
            )}

            {isColumnsOpen && (
              <TableColumnMenu
                allColumns={data.length > 0 ? Object.keys(data[0]) : []}
                columns={columns}
                setColumns={(columns) => updateTablePreferences({ columns })}
              />
            )}

            <div tabIndex={-1} className="overflow-x-auto rounded border-2 border-border">
              <TableElement
                data={coloredResult}
                columns={columns}
                sort={sort}
                setSort={(sort) => updateTableConfig({ sort })}
                allRowIds={data.map((row) => row.__id__) ?? []}
                selected={selected}
                setSelected={(selected) => updateTableConfig({ selected })}
                redirectColumn={redirectColumn}
                onRedirect={onRedirect}
              />

              {coloredResult.length === 0 && !isLoading && !error && (
                <div className="min-h-[3rem]" />
              )}
              {isLoading && <TableLoader />}
              {error && <TableError error={error} />}
            </div>

            <div className="ms-0.5 flex justify-between">
              <div className="text-xs leading-[0.65rem] text-grey">
                {timestamp && executionTime !== undefined && (
                  <span>
                    {new Date(timestamp).toLocaleTimeString("de-de")} - {executionTime}ms
                  </span>
                )}
              </div>

              {count && count.total > 25 && pageSize >= 25 && (
                <TablePagination
                  count={count.total - count.filtered}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={(pageIndex) => updateTableConfig({ pageIndex })}
                  setPageSize={(pageSize) => updateTablePreferences({ pageSize })}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
