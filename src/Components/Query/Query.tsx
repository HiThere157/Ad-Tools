import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setQuery } from "../../Redux/data";
import { defaultQuery, defaultQueryFilter } from "../../Config/default";

import Button from "../Button";
import Checkbox from "../Checkbox";
import Input from "../Input/Input";
import Dropdown from "../Dropdown/Dropdown";
import MultiDropdown from "../Dropdown/MultiDropdown";
import QueryFilter from "./QueryFilter";

import { BsPlusLg } from "react-icons/bs";

type QueryProps = {
  page: string;
  tabId: number;
  type: "ad" | "azure";
  onSubmit: () => void;
};
export default function Query({ page, tabId, type, onSubmit }: QueryProps) {
  const { query } = useSelector((state: RootState) => state.data);
  const { queryDomains } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  const tabQuery = query[page]?.[tabId] ?? defaultQuery;
  const { isAdvanced, filters, servers } = tabQuery;

  // Update the query with a partial query
  const updateTabQuery = (query: Partial<Query>) =>
    dispatch(setQuery({ page, tabId, query: { ...tabQuery, ...query } }));

  // We only want to submit if the query is somewhat valid
  const beforeSubmit = () => {
    // If we are querying for ad and there are no servers, don't submit
    if (type === "ad" && servers.length === 0) return;

    if (isAdvanced) {
      if (!Object.values(filters).some(({ value }) => value !== "")) return;
    } else {
      if (!filters.find(({ property }) => property === "Name")?.value) return;
    }

    onSubmit();
  };

  // If there are no filters, set the default filter
  useEffect(() => {
    if (filters.length === 0) {
      updateTabQuery({ filters: [defaultQueryFilter] });
    }
  });

  // Set default server for ad queries if there are queryDomains and the query is the default query
  useEffect(() => {
    if (type === "ad" && tabId !== 0 && tabQuery === defaultQuery && queryDomains.length > 0) {
      updateTabQuery({ servers: [queryDomains[0]] });
    }
  }, [queryDomains, tabQuery, tabId]);

  return (
    <div
      className={
        "m-1.5 mb-4 flex items-start gap-1 " + (isAdvanced && type == "ad" ? "flex-col" : "")
      }
    >
      {isAdvanced ? (
        <div className="flex items-start gap-2">
          <span>Filter:</span>

          <div className="flex items-start gap-1">
            <div className="grid grid-cols-[auto_auto_auto_auto] items-start gap-1">
              {filters.map((filter, filterIndex) => (
                <QueryFilter
                  key={filterIndex}
                  filter={filter}
                  setFilter={(filter) => {
                    const newFilters = [...filters];
                    newFilters[filterIndex] = filter;
                    updateTabQuery({ filters: newFilters });
                  }}
                  onRemoveFilter={() =>
                    updateTabQuery({ filters: filters.filter((_, i) => i !== filterIndex) })
                  }
                  onSubmit={beforeSubmit}
                />
              ))}
            </div>

            <Button
              className="p-1"
              onClick={() => updateTabQuery({ filters: [...filters, defaultQueryFilter] })}
            >
              <BsPlusLg />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <span>Identity:</span>

          <Input
            value={filters.find(({ property }) => property === "Name")?.value ?? ""}
            onChange={(name) => {
              updateTabQuery({ filters: [{ property: "Name", value: name }] });
            }}
            autoFocus={true}
            onEnter={beforeSubmit}
          />
        </div>
      )}

      <div className="flex gap-1">
        {type === "ad" && (
          <>
            {isAdvanced ? (
              <div className="flex items-start gap-2">
                <span>Domains:</span>

                <MultiDropdown
                  items={queryDomains}
                  value={servers}
                  onChange={(servers) => updateTabQuery({ servers })}
                />
              </div>
            ) : (
              <div className="flex items-start gap-1">
                <span className="text-grey">@</span>

                <Dropdown
                  items={queryDomains}
                  value={servers[0]}
                  onChange={(server) => updateTabQuery({ servers: [server] })}
                />
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-1.5">
          <Button onClick={beforeSubmit}>Run</Button>

          <label className="flex items-center gap-1">
            <Checkbox
              checked={isAdvanced == true}
              onChange={(isAdvanced) => {
                // If we are switching from advanced to simple, remove all filters except for the name filter and all servers except for the first one
                // If no name filter exists, add one
                if (!isAdvanced) {
                  const nameFilter = filters.find(({ property }) => property === "Name");
                  const server = servers[0];
                  updateTabQuery({
                    isAdvanced,
                    filters: nameFilter ? [nameFilter] : [{ property: "Name", value: "" }],
                    servers: server ? [server] : [],
                  });
                } else {
                  updateTabQuery({ isAdvanced });
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
