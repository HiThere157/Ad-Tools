import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setQuery } from "../../Redux/data";
import { defaultQuery } from "../../Config/default";
import { getFilterValue } from "../../Helper/utils";

import Button from "../Button";
import Input from "../Input/Input";

type AzureQueryProps = {
  page: string;
  tabId: number;
  onSubmit: () => void;
};
export default function AzureQuery({ page, tabId, onSubmit }: AzureQueryProps) {
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabQuery = query[page]?.[tabId] ?? defaultQuery;
  const { filters } = tabQuery;

  // Update the query with a partial query
  const updateTabQuery = (query: Partial<Query>) =>
    dispatch(setQuery({ page, tabId, query: { ...tabQuery, ...query } }));

  // We only want to submit if the query is somewhat valid
  const beforeSubmit = () => {
    if (getFilterValue(filters, "Name") === "") return;

    onSubmit();
  };

  return (
    <div className="m-1.5 mb-4 flex items-start gap-1">
      <div className="flex items-start gap-2">
        <span>Search String:</span>

        <Input
          value={getFilterValue(filters, "Name")}
          onChange={(name) => {
            updateTabQuery({ filters: [{ property: "Name", value: name }] });
          }}
          autoFocus={true}
          onEnter={beforeSubmit}
        />
      </div>

      <Button onClick={beforeSubmit}>Run</Button>
    </div>
  );
}
