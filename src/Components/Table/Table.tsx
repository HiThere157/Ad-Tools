import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setTableConfig } from "../../Redux/data";
import { setTablePreferences } from "../../Redux/preferences";
import { defaultTableConfig, defaultTablePreferences } from "../../Config/default";
import { friendly } from "../../Config/lookup";
import { filterData, sortData, paginateData, colorData } from "../../Helper/array";
import { stringify } from "../../Helper/string";

import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TableFilterMenu from "./TableFilterMenu";
import TableHighlightMenu from "./TableHighlightMenu";
import TableElement from "./TableElement";
import TablePagination from "./TablePagination";
import TableLoader from "./TableLoader";
import TableError from "./TableError";

type TableProps = {
  title: string;
  page: string;
  tabId: number;
  name: string;
  isSearchTable?: boolean;
  redirectColumn?: string;
  onRedirect?: (row: ResultObject, newTab?: boolean) => void;
};
export default function Table({
  title,
  page,
  tabId,
  name,
  isSearchTable,
  redirectColumn,
  onRedirect,
}: TableProps) {
  const { tablePreferences } = useSelector((state: RootState) => state.preferences);
  const { results, tableConfigs } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const keyResults = results[page]?.[tabId]?.[name];
  const keyTableConfigs = tableConfigs[page]?.[tabId]?.[name] ?? defaultTableConfig;
  const keyTablePreferences = tablePreferences[page]?.[name] ?? defaultTablePreferences;

  // Update the table config with a partial config
  const updateKeyTableConfig = (config: Partial<TableConfig>) =>
    dispatch(setTableConfig({ page, tabId, name, config: { ...keyTableConfigs, ...config } }));

  // Update the table preferences with a partial preferences
  const updateKeyTablePreferences = (persistentConfig: Partial<TablePreferences>) =>
    dispatch(
      setTablePreferences({
        page,
        name,
        preferences: { ...keyTablePreferences, ...persistentConfig },
      }),
    );

  const { result, error, timestamp, executionTime } = keyResults ?? {};
  const { data = [], columns = [] } = result ?? {};
  const isLoading = keyResults === null;

  const { isFilterOpen, isHighlightOpen } = keyTableConfigs;
  const { isCollapsed, filters, hiddenColumns, sort, selected, pageIndex } = keyTableConfigs;
  const { pageSize, highlights, savedFilters, savedFilterName } = keyTablePreferences;

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
    if (!result) return undefined;

    return {
      total: data.length,
      filtered: data.length - filteredResult.length,
      selected: selected.length,
    };
  }, [result, data, filteredResult, selected]);

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

  if (isSearchTable && keyResults === undefined) return null;

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
          setIsCollapsed={(isCollapsed) => updateKeyTableConfig({ isCollapsed })}
        />

        {count && count.total > 10 && !isCollapsed && (
          <TablePagination
            count={count.total - count.filtered}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={(pageIndex) => updateKeyTableConfig({ pageIndex })}
            setPageSize={(pageSize) => updateKeyTablePreferences({ pageSize })}
          />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex gap-1">
          <TableActions
            onFilterMenu={() => updateKeyTableConfig({ isFilterOpen: !isFilterOpen })}
            onHighlightMenu={() => updateKeyTableConfig({ isHighlightOpen: !isHighlightOpen })}
            onCopy={exportAsCSV}
            filters={selectedFilter}
            columns={columns}
            highlights={highlights}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={(hiddenColumns) => updateKeyTableConfig({ hiddenColumns })}
          />

          <div className="flex min-w-0 flex-grow flex-col gap-1">
            {isFilterOpen && (
              <TableFilterMenu
                columns={columns}
                filters={selectedFilter}
                setFilters={(filters) => updateKeyTableConfig({ filters, pageIndex: 0 })}
                savedFilters={savedFilters}
                setSavedFilters={(savedFilters, savedFilterName) =>
                  updateKeyTablePreferences({ savedFilters, savedFilterName })
                }
                savedFilterName={savedFilterName}
                setSavedFilterName={(savedFilterName) =>
                  updateKeyTablePreferences({ savedFilterName })
                }
              />
            )}

            {isHighlightOpen && (
              <TableHighlightMenu
                highlights={highlights}
                setHighlights={(highlights) => updateKeyTablePreferences({ highlights })}
              />
            )}

            <div tabIndex={-1} className="overflow-x-auto rounded border-2 border-border">
              <TableElement
                data={coloredResult}
                columns={columns.filter((column) => !hiddenColumns.includes(column))}
                sort={sort}
                setSort={(sort) => updateKeyTableConfig({ sort })}
                allRowIds={data.map((row) => row.__id__) ?? []}
                selected={selected}
                setSelected={(selected) => updateKeyTableConfig({ selected })}
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
                  setPageIndex={(pageIndex) => updateKeyTableConfig({ pageIndex })}
                  setPageSize={(pageSize) => updateKeyTablePreferences({ pageSize })}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
