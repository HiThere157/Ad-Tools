import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setAzureLoginUPN, setQueryDomains } from "../Redux/preferences";

import SettingLayout from "../Layout/SettingLayout";
import Input from "../Components/Input/Input";
import Button from "../Components/Button";
import EditList from "../Components/EditList";

export default function Settings() {
  const { queryDomains, azureLoginUPN } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-wrap items-start px-2">
      <SettingLayout title="Query Domains">
        <EditList list={queryDomains} onChange={(list) => dispatch(setQueryDomains(list))} />
      </SettingLayout>

      <SettingLayout title="Azure Ad Login">
        <div className="flex gap-2">
          <span>UPN:</span>
          <Input value={azureLoginUPN} onChange={(value) => dispatch(setAzureLoginUPN(value))} />
        </div>
      </SettingLayout>

      <SettingLayout title="Storage">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Clear Volatile
          </Button>
          <Button
            onClick={() => {
              window.localStorage.removeItem("persist:root");
              window.location.reload();
            }}
          >
            Clear Persistent
          </Button>

          <ul className="[&>li]:leading-5">
            <li>Tabs</li>
            <li>Results</li>
          </ul>
          <ul className="[&>li]:leading-5">
            <li>Preferences</li>
            <li>Query Domains</li>
            <li>Filter Presets</li>
            <li>Azure Login UPN</li>
            <li>(Volatile Storage)</li>
          </ul>
        </div>
      </SettingLayout>
    </div>
  );
}
