import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setQuery } from "../../Redux/data";
import { defaultAdQuery } from "../../Config/default";
import { useQueryDomains } from "../../Helper/api";

import Button from "../Button";
import Checkbox from "../Checkbox";
import Input from "../Input/Input";
import MultiDropdown from "../Dropdown/MultiDropdown";

type AdQueryProps = {
  page: string;
  tabId: number;
  onSubmit: () => void;
};
export default function AdQuery({ page, tabId, onSubmit }: AdQueryProps) {
  const availableServers = useQueryDomains();

  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabQuery = query[page]?.[tabId] ?? defaultAdQuery;
  const { isAdvanced, filter, servers } = tabQuery;

  // We only want to submit if there is a filter or servers
  const beforeSubmit = () => {
    if (!Object.values(filter).some((value) => value !== "") || servers.length === 0) return;
    onSubmit();
  };

  // Update the query with a partial query
  const updateTabQuery = (query: Partial<AdQuery>) =>
    dispatch(setQuery({ page, tabId, query: { ...tabQuery, ...query } }));

  // If the default query is selected and the available servers are loaded, select the first server as default
  useLayoutEffect(() => {
    if (tabQuery === defaultAdQuery && availableServers.length > 0 && tabId !== 0) {
      updateTabQuery({ servers: [availableServers[0]] });
    }
  }, [availableServers]);

  return (
    <div className="m-1.5 mb-4 flex items-center gap-1">
      <label className="flex items-center gap-2">
        <span>Identity:</span>

        <Input
          value={filter.Name ?? ""}
          onChange={(Name) => {
            updateTabQuery({ filter: { Name } });
          }}
          onEnter={beforeSubmit}
        />
      </label>

      <MultiDropdown
        items={availableServers}
        value={servers}
        onChange={(servers) => {
          updateTabQuery({ servers });
        }}
      />

      <Button onClick={beforeSubmit}>Run</Button>

      <label className="ml-2 flex items-center gap-1.5">
        <Checkbox
          checked={isAdvanced}
          onChange={(isAdvanced) => {
            updateTabQuery({ isAdvanced });
          }}
        />
        <span>Advanced</span>
      </label>
    </div>
  );
}
