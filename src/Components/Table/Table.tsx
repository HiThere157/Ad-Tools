import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { friendly } from "../../Config/lookup";
import { defaultTableConfig, defaultTablePreferences } from "../../Config/default";
import { filterData, sortData, paginateData, colorData } from "../../Helper/array";
import { stringify } from "../../Helper/string";
import { RootState } from "../../Redux/store";

import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TableFilterMenu from "./TableFilterMenu";
import TableElement from "./TableElement";
import TablePagination from "./TablePagination";
import TableLoader from "./TableLoader";
import TableError from "./TableError";
import TableHighlightMenu from "./TableHighlightMenu";
import { setTableConfig } from "../../Redux/data";
import { setTablePreferences } from "../../Redux/preferences";

type TableProps = {
  title: string;
  page: string;
  tabId: number;
  name: string;
  onRedirect?: (row: PSResult) => void;
};
export default function Table({ title, page, tabId, name, onRedirect }: TableProps) {
  const { tablePreferences } = useSelector((state: RootState) => state.preferences);
  const { results, tableConfigs } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const keyResults = results[page]?.[tabId]?.[name];
  const keyTableConfigs = tableConfigs[page]?.[tabId]?.[name] ?? defaultTableConfig;
  const keyTablePreferences = tablePreferences[name] ?? defaultTablePreferences;

  const { result, error, timestamp, executionTime } = keyResults ?? {};
  const { data = [], columns = [] } = result ?? {};
  const isLoading = keyResults === null;

  const { isFilterOpen, isHighlightOpen } = keyTableConfigs;
  const { isCollapsed, filters, hiddenColumns, sort, selected, pageIndex } = keyTableConfigs;
  const { pageSize, highlights } = keyTablePreferences;

  const filteredResult = useMemo(() => {
    return filterData(data, filters);
  }, [data, filters]);

  const sortedResult = useMemo(() => {
    return sortData(filteredResult, sort);
  }, [filteredResult, sort]);

  const paginationResult = useMemo(() => {
    return paginateData(sortedResult, pageIndex, pageSize);
  }, [sortedResult, pageIndex, pageSize]);

  const coloredResult = useMemo(() => {
    return colorData(paginationResult, highlights);
  }, [paginationResult, highlights]);

  const count: ResultCount | undefined = useMemo(() => {
    // Only show count if acutal data is available
    if (!result) return undefined;

    return {
      total: data.length,
      filtered: data.length - filteredResult.length,
      selected: selected.length,
    };
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

  // Update functions for volatile and persistent config
  const updateConfig = (config: Partial<TableConfig>) => {
    dispatch(setTableConfig({ page, tabId, name, config: { ...keyTableConfigs, ...config } }));
  };
  const updatePreferences = (persistentConfig: Partial<TablePreferences>) => {
    dispatch(
      setTablePreferences({ name, preferences: { ...keyTablePreferences, ...persistentConfig } }),
    );
  };

  return (
    <section className="mb-7 w-fit min-w-[35rem] max-w-full">
      <div className="ms-1 flex justify-between">
        <TableHeader
          title={title}
          count={count}
          isCollapsed={isCollapsed}
          setIsCollapsed={(isCollapsed) => updateConfig({ isCollapsed })}
        />

        {count && count.total > 25 && !isCollapsed && (
          <TablePagination
            count={count.total - count.filtered}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={(pageIndex) => updateConfig({ pageIndex })}
            setPageSize={(pageSize) => updatePreferences({ pageSize })}
          />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex gap-1">
          <TableActions
            onFilterMenu={() => updateConfig({ isFilterOpen: !isFilterOpen })}
            onHighlightMenu={() => updateConfig({ isHighlightOpen: !isHighlightOpen })}
            onCopy={exportAsCSV}
            filters={filters}
            columns={columns}
            highlights={highlights}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={(hiddenColumns) => updateConfig({ hiddenColumns })}
          />

          <div className="flex min-w-0 flex-grow flex-col gap-1">
            {isFilterOpen && (
              <TableFilterMenu
                columns={columns}
                filters={filters}
                setFilters={(filters) => updateConfig({ filters, pageIndex: 0 })}
              />
            )}

            {isHighlightOpen && (
              <TableHighlightMenu
                highlights={highlights}
                setHighlights={(highlights) => updatePreferences({ highlights })}
              />
            )}

            <div className="min-h-[5.5rem] overflow-x-auto rounded border-2 border-border">
              <TableElement
                data={coloredResult}
                columns={columns.filter((column) => !hiddenColumns.includes(column))}
                sort={sort}
                setSort={(sort) => updateConfig({ sort })}
                allRowIds={data.map((row) => row.__id__) ?? []}
                selected={selected}
                setSelected={(selected) => updateConfig({ selected })}
                onRedirect={onRedirect}
              />

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

              {count && count.total > 25 && (
                <TablePagination
                  count={count.total - count.filtered}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={(pageIndex) => updateConfig({ pageIndex })}
                  setPageSize={(pageSize) => updatePreferences({ pageSize })}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
