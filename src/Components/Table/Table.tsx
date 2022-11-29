import { useEffect, useState } from "react";
import { useSessionStorage } from "../../Hooks/useStorage";

import { ColumnDefinition } from "../../Config/default";
import { ResultData } from "../../Types/api";
import stringify from "../../Helper/stringify";

import TableElement from "./TableElement";
import ActionMenu from "./ActionMenu";
import FilterMenu from "./FilterMenu";
import ErrorMessage from "./ErrorMessage";
import Title from "./Title";
import Loader from "./Loader";

type TableProps = {
  title: string,
  name: string,
  columns: ColumnDefinition[],
  data: ResultData,
  onRedirect?: Function
  isLoading?: boolean,
}
export default function Table({ title, name, columns, data, onRedirect, isLoading = false }: TableProps) {
  const [sortedColumn, setSortedColumn] = useSessionStorage(
    name + "_sortedColumn",
    ""
  );
  const [sortDesc, setSortDesc] = useSessionStorage(name + "_sortDesc", true);
  const [filter, setFilter] = useSessionStorage(name + "_filter", {});
  const [selected, setSelected] = useSessionStorage(name + "_selected", []);

  const [isFilterOpen, setIsFilterOpen] = useSessionStorage(
    name + "_isFilterOpen",
    false
  );

  const [isFilterHighlighted, setIsFilterHighlighted] = useState(false);

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

  const updateFilter = (key: string, filterString: string) => {
    const newFilter = { ...filter, [key]: filterString.trim() };
    Object.keys(newFilter).forEach(
      (key) => newFilter[key] === "" && delete newFilter[key]
    );
    setFilter(newFilter);
  };

  const resetTable = () => {
    setSortedColumn("");
    setSortDesc(true);
    setFilter({});
  };

  const copyToClip = (onlySelected: boolean) => {
    let ret = "";
    data.output?.forEach((entry, index) => {
      if (onlySelected && !selected.includes(index)) return;
      ret += columns.map((column) => stringify(entry[column.key], false)).join("\u{9}") + "\n";
    });
    navigator.clipboard.writeText(ret);
  };

  return (
    <section>
      <Title title={title} n={data.output?.length ?? 0} nSelected={selected.length} />
      <div className="flex space-x-1">
        <ActionMenu
          onResetTable={resetTable}
          onCopy={copyToClip}
          onCopySelection={() => copyToClip(true)}
          onFilter={() => setIsFilterOpen(!isFilterOpen)}
          isFilterHighlighted={isFilterHighlighted}
        />
        <FilterMenu
          isOpen={isFilterOpen}
          columns={columns}
          filter={filter}
          onFilterChange={updateFilter}
        />
        <div className="border-2 border-primaryBorder rounded-md h-fit min-h-[4rem] overflow-auto">
          <TableElement
            entries={data.output}
            columns={columns}
            sortDesc={sortDesc}
            sortedColumn={sortedColumn}
            filter={filter}
            selected={selected}
            onSelectedChange={setSelected}
            onHeaderClick={updateSortArguments}
            onRedirect={onRedirect}
          />
          <ErrorMessage error={data.error} />
          <Loader isVisible={isLoading && data.output?.length === 0} />
        </div>
      </div>
    </section>
  );
}
