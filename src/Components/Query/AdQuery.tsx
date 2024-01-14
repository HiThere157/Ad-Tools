import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { defaultQuery, defaultQueryFilter } from "../../Config/default";

import Button from "../Button";
import Checkbox from "../Checkbox";
import Input from "../Input/Input";
import MultiDropdown from "../Dropdown/MultiDropdown";
import QueryFilter from "./QueryFilter";

import { BsPlusLg } from "react-icons/bs";
import { getFilterValue } from "../../Helper/utils";

type AdQueryProps = {
  query: Query;
  setQuery: (query: Query) => void;
  onSubmit: () => void;
};
export default function AdQuery({ query, setQuery, onSubmit }: AdQueryProps) {
  const { queryDomains } = useSelector((state: RootState) => state.preferences);

  const { isAdvanced, filters, servers } = query;

  const updateQuery = useCallback(
    (partialQuery: Partial<Query>) => {
      setQuery({ ...query, ...partialQuery });
    },
    [query, setQuery],
  );

  // We only want to submit if the query is somewhat valid
  const beforeSubmit = () => {
    if (servers.length === 0) return;

    if (isAdvanced) {
      if (!Object.values(filters).some(({ value }) => value !== "")) return;
    } else {
      if (getFilterValue(filters, "Name") === "") return;
    }

    onSubmit();
  };

  // If there are no filters, set the default filter
  useEffect(() => {
    if (filters.length === 0) updateQuery({ filters: [defaultQueryFilter] });
  });

  // Set default server for ad queries if there are queryDomains and the query is the default query
  useEffect(() => {
    if (query === defaultQuery && queryDomains.length > 0) {
      updateQuery({ servers: [queryDomains[0]] });
    }
  }, [queryDomains, query, updateQuery]);

  return (
    <div className={"m-1.5 mb-4 flex gap-1 " + (isAdvanced ? "flex-col" : "")}>
      {isAdvanced ? (
        <div className="flex gap-2">
          <span>Filter:</span>

          <div className="flex items-start gap-1">
            <div className="grid grid-cols-[auto_auto_auto_auto] gap-1">
              {filters.map((filter, filterIndex) => (
                <QueryFilter
                  key={filterIndex}
                  filter={filter}
                  setFilter={(filter) => {
                    const newFilters = [...filters];
                    newFilters[filterIndex] = filter;
                    updateQuery({ filters: newFilters });
                  }}
                  onRemoveFilter={() =>
                    updateQuery({ filters: filters.filter((_, i) => i !== filterIndex) })
                  }
                  onSubmit={beforeSubmit}
                />
              ))}
            </div>

            <Button
              className="p-1"
              onClick={() => updateQuery({ filters: [...filters, defaultQueryFilter] })}
            >
              <BsPlusLg />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <span>Identity:</span>

          <Input
            value={getFilterValue(filters, "Name")}
            onChange={(name) => {
              updateQuery({ filters: [{ property: "Name", value: name }] });
            }}
            autoFocus={true}
            onEnter={beforeSubmit}
          />
        </div>
      )}

      <div className="flex items-start gap-1">
        <div className="flex gap-1">
          {isAdvanced ? (
            <span className="mr-1">Domains:</span>
          ) : (
            <span className="text-grey">@</span>
          )}

          <MultiDropdown
            items={queryDomains}
            value={servers}
            onChange={(servers) => updateQuery({ servers })}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button onClick={beforeSubmit}>Run</Button>

          <label className="flex items-center gap-1">
            <Checkbox
              checked={isAdvanced == true}
              onChange={(isAdvanced) => {
                // If we are switching from advanced to simple, remove all filters except for the name filter
                // If no name filter exists, add one
                if (!isAdvanced) {
                  const nameFilter = filters.find(({ property }) => property === "Name");
                  updateQuery({
                    isAdvanced,
                    filters: nameFilter ? [nameFilter] : [{ property: "Name", value: "" }],
                    servers,
                  });
                } else {
                  updateQuery({ isAdvanced });
                }
              }}
            />
            <span>Advanced</span>
          </label>
        </div>
      </div>
    </div>
  );
}
