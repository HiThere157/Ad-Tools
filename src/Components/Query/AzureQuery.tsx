import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { getFilterValue } from "../../Helper/utils";

import Button from "../Button";
import Input from "../Input/Input";
import AzureLogin from "../Popup/AzureLogin";

type AzureQueryProps = {
  query: Query;
  setQuery: (query: Query) => void;
  onSubmit: () => void;
};
export default function AzureQuery({ query, setQuery, onSubmit }: AzureQueryProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { executingAzureUser } = useSelector((state: RootState) => state.environment.azure);

  const { filters } = query;

  const updateQuery = (partialQuery: Partial<Query>) => {
    setQuery({ ...query, ...partialQuery });
  };

  // We only want to submit if the query is somewhat valid
  const beforeSubmit = () => {
    if (getFilterValue(filters, "Name") === "") return;
    if (!executingAzureUser) return setIsLoginOpen(true);

    onSubmit();
  };

  return (
    <div className="m-1.5 mb-4 flex gap-1">
      <div className="flex gap-2">
        <span>Search String:</span>

        <Input
          value={getFilterValue(filters, "Name")}
          onChange={(name) => {
            updateQuery({ filters: [{ property: "Name", value: name }] });
          }}
          autoFocus={true}
          onEnter={beforeSubmit}
        />
      </div>

      <Button onClick={beforeSubmit}>Run</Button>

      <AzureLogin
        isOpen={isLoginOpen}
        onExit={(status) => {
          setIsLoginOpen(false);
          if (status) onSubmit();
        }}
      />
    </div>
  );
}
