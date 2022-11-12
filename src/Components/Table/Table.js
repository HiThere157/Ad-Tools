import { useEffect, useState } from "react";
import { useSessionStorage } from "../../Helper/useStorage";

import { TableElement, ErrorMessage } from "./TableElement";
import { ActionMenu, FilterMenu } from "./ActionMenu";
import Title from "./Title";

export default function Table({
  title,
  name,
  columns,
  data,
  onRedirect,
}) {
  const [sortedColumn, setSortedColumn] = useSessionStorage(
    name + "_sortedColumn",
    ""
  );
  const [sortDesc, setSortDesc] = useSessionStorage(name + "_sortDesc", true);
  const [filter, setFilter] = useSessionStorage(name + "_filter", {});

  const [isFilterOpen, setIsFilterOpen] = useSessionStorage(
    name + "_isFilterOpen",
    false
  );

  const [isCopyHighlighted, setIsCopyHighlighted] = useState(false);
  const [isFilterHighlighted, setIsFilterHighlighted] = useState(false);

  useEffect(() => {
    setIsFilterHighlighted(Object.keys(filter).length !== 0);
  }, [filter]);

  const updateSortArguments = (key) => {
    if (sortedColumn === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortedColumn(key);
      setSortDesc(true);
    }
  };

  const updateFilter = (key, filterString) => {
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

  const copyToClip = () => {
    let ret = "";
    data.output?.forEach((entry) => {
      ret += columns.map((column) => entry[column.key]).join("\u{9}") + "\n";
    });
    navigator.clipboard.writeText(ret);

    if (isCopyHighlighted) return;
    setIsCopyHighlighted(true);
    setTimeout(() => {
      setIsCopyHighlighted(false);
    }, 5000);
  };

  return (
    <section>
      <Title title={title} n={data.output?.length ?? 0} />
      <div className="flex space-x-1">
        <ActionMenu
          onResetTable={resetTable}
          onCopy={copyToClip}
          onFilter={() => {
            setIsFilterOpen(!isFilterOpen);
          }}
          isCopyHighlighted={isCopyHighlighted}
          isFilterHighlighted={isFilterHighlighted}
        />
        <FilterMenu
          isOpen={isFilterOpen}
          columns={columns}
          filter={filter}
          onFilterChange={updateFilter}
        />
        <div className="border-2 border-primaryBorder rounded-md overflow-auto">
          <TableElement
            entries={data.output}
            columns={columns}
            sortDesc={sortDesc}
            sortedColumn={sortedColumn}
            filter={filter}
            onHeaderClick={updateSortArguments}
            onRedirect={onRedirect}
          />
          <ErrorMessage error={data.error} />
        </div>
      </div>
    </section>
  );
}
