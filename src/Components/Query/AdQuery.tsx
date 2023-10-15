import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { defaultAdQuery } from "../../Config/default";
import { useQueryDomains } from "../../Helper/api";
import { setQuery } from "../../Redux/data";

import Button from "../Button";
import Checkbox from "../Checkbox";
import MultiDropdown from "../Dropdown/MultiDropdown";
import Input from "../Input/Input";

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

  const beforeSubmit = () => {
    if (Object.keys(filter).length === 0 || servers.length === 0) return;
    onSubmit();
  };

  const updateQuery = (query: Partial<AdQuery>) => {
    dispatch(setQuery({ page, tabId, query: { ...tabQuery, ...query } }));
  };

  useLayoutEffect(() => {
    if (tabQuery === defaultAdQuery && availableServers.length > 0) {
      updateQuery({ servers: [availableServers[0]] });
    }
  }, [availableServers]);

  return (
    <div className="m-1.5 mb-4 flex items-center gap-1">
      <label className="flex items-center gap-2">
        <span>Identity:</span>

        <Input
          value={filter.Name ?? ""}
          onChange={(Name) => {
            updateQuery({ filter: { Name } });
          }}
          onEnter={beforeSubmit}
        />
      </label>

      <MultiDropdown
        items={availableServers}
        value={servers}
        onChange={(servers) => {
          updateQuery({ servers });
        }}
      />

      <Button onClick={beforeSubmit}>Run</Button>

      <label className="ml-2 flex items-center gap-1.5">
        <Checkbox
          checked={isAdvanced}
          onChange={(isAdvanced) => {
            updateQuery({ isAdvanced });
          }}
        />
        <span>Advanced</span>
      </label>
    </div>
  );
}
