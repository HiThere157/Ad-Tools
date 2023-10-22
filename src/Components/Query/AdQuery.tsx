import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setQueryDomains } from "../../Redux/preferences";
import { setQuery } from "../../Redux/data";
import { defaultAdQuery, defaultQueryFilter } from "../../Config/default";
import { getDnsSuffixList } from "../../Helper/api";

import Button from "../Button";
import Checkbox from "../Checkbox";
import Input from "../Input/Input";
import MultiDropdown from "../Dropdown/MultiDropdown";
import QueryFilter from "./QueryFilter";

import { BsPlusLg } from "react-icons/bs";

type AdQueryProps = {
  page: string;
  tabId: number;
  onSubmit: () => void;
};
export default function AdQuery({ page, tabId, onSubmit }: AdQueryProps) {
  const { query } = useSelector((state: RootState) => state.data);
  const { queryDomains } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  const tabQuery = query[page]?.[tabId] ?? defaultAdQuery;
  const { isAdvanced, filters, servers } = tabQuery;

  // Update the query with a partial query
  const updateTabQuery = (query: Partial<AdQuery>) =>
    dispatch(setQuery({ page, tabId, query: { ...tabQuery, ...query } }));

  // We only want to submit if there is a filter or servers
  const beforeSubmit = () => {
    if (servers.length === 0) return;

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

  // If there are no queryDomains, get them
  useEffect(() => {
    if (queryDomains.length === 0) {
      getDnsSuffixList().then((domains) => dispatch(setQueryDomains(domains)));
    }
  }, []);

  // Set default server if there are queryDomains and the query is the default query
  useEffect(() => {
    if (tabQuery === defaultAdQuery && queryDomains.length > 0 && tabId !== 0) {
      updateTabQuery({ servers: [queryDomains[0]] });
    }
  }, [queryDomains, tabQuery, tabId]);

  return (
    <div className="m-1.5 mb-4 flex items-start gap-1">
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

      <span className="text-grey">@</span>

      <MultiDropdown
        items={queryDomains}
        value={servers}
        onChange={(servers) => updateTabQuery({ servers })}
      />

      <div className="flex items-center gap-1.5">
        <Button onClick={beforeSubmit}>Run</Button>

        <label className="flex items-center gap-1">
          <Checkbox
            checked={isAdvanced}
            onChange={(isAdvanced) => {
              // If we are switching from advanced to simple, remove all filters except for the name filter
              // If no name filter exists, add one
              if (!isAdvanced) {
                const nameFilter = filters.find(({ property }) => property === "Name");
                updateTabQuery({
                  isAdvanced,
                  filters: nameFilter ? [nameFilter] : [{ property: "Name", value: "" }],
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
  );
}
