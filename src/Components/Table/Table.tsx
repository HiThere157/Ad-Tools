import { useEffect, useState } from "react";
import { useLocalStorage, useSessionStorage } from "../../Hooks/useStorage";

import { ColumnDefinition, Filter } from "../../Types/table";

import { Entry, ResultData } from "../../Types/api";
import stringify from "../../Helper/stringify";

import TableElement from "./TableElement";
import ActionMenu from "./ActionMenu";
import FilterMenu from "./FilterMenu";
import ErrorMessage from "./ErrorMessage";
import Title from "./Title";
import Loader from "./Loader";

type TableProps = {
  title: string;
  name: string;
  columns: ColumnDefinition[];
  data: ResultData;
  onRedirect?: (entry: Entry) => any;
  isLoading?: boolean;
};
export default function Table({
  title,
  name,
  columns,
  data,
  onRedirect,
  isLoading = false,
}: TableProps) {
  const [sortedColumn, setSortedColumn] = useSessionStorage<string>(
    name + "_sortedColumn",
    "",
  );
  const [sortDesc, setSortDesc] = useSessionStorage<boolean>(
    name + "_sortDesc",
    true,
  );
  const [filter, setFilter] = useSessionStorage<Filter>(name + "_filter", {});
  const [currentSavedFilter, setCurrentSavedFilter] = useLocalStorage<string>(
    name + "_currentSavedFilter",
    "No Preset",
  );
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [selected, setSelected] = useSessionStorage<number[]>(
    name + "_selected",
    [],
  );

  const [isFilterOpen, setIsFilterOpen] = useSessionStorage<boolean>(
    name + "_isFilterOpen",
    false,
  );
  const [isFilterHighlighted, setIsFilterHighlighted] =
    useState<boolean>(false);

  useEffect(() => {
    setIsFilterHighlighted(Object.keys(filter).length !== 0);
  }, [filter]);

  const updateSortArguments = (key: string) => {
    if (sortedColumn === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortedColumn(key);
      setSortDesc(true);
    }
  };

  const resetTable = () => {
    setSortedColumn("");
    setSortDesc(true);
    setFilter({});
    setCurrentSavedFilter("No Preset");
  };

  const copyToClip = (onlySelected: boolean) => {
    let ret = "";
    data.output?.forEach((entry, index) => {
      if (onlySelected && !selected.includes(index)) return;
      ret +=
        columns
          .map((column) => stringify(entry[column.key], false))
          .join("\u{9}") + "\n";
    });
    navigator.clipboard.writeText(ret);
  };

  return (
    <section>
      <Title
        title={title}
        n={data.output?.length ?? 0}
        nSelected={selected.length}
        nFiltered={filteredCount}
      />
      <div className="flex space-x-1">
        <ActionMenu
          onResetTable={resetTable}
          onCopy={() => copyToClip(false)}
          onCopySelection={() => copyToClip(true)}
          onFilter={() => setIsFilterOpen(!isFilterOpen)}
          isFilterHighlighted={isFilterHighlighted}
        />
        <FilterMenu
          isOpen={isFilterOpen}
          columns={columns}
          filter={filter}
          onFilterChange={setFilter}
          currentSavedFilter={currentSavedFilter}
          setCurrentSavedFilter={setCurrentSavedFilter}
        />
        <div className="border-2 border-primaryBorder rounded h-fit min-h-[4rem] overflow-auto">
          <TableElement
            entries={data.output}
            columns={columns}
            sortDesc={sortDesc}
            sortedColumn={sortedColumn}
            filter={filter}
            onFilter={setFilteredCount}
            selected={selected}
            onSelectedChange={setSelected}
            onHeaderClick={updateSortArguments}
            onRedirect={onRedirect}
          />
          <ErrorMessage error={data.error} />
          <Loader
            isVisible={isLoading && data.output?.length === 0 && !data.error}
          />
        </div>
      </div>
    </section>
  );
}
