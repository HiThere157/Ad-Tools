import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setAzureLoginUPN, setQueryDomains } from "../Redux/preferences";

import SettingLayout from "../Layout/SettingLayout";
import Input from "../Components/Input/Input";
import EditList from "../Components/EditList";

export default function Settings() {
  const { queryDomains, azureLoginUPN } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  return (
    <div className="flex items-start px-2">
      <SettingLayout title="Query Domains">
        <EditList list={queryDomains} onChange={(list) => dispatch(setQueryDomains(list))} />
      </SettingLayout>

      <SettingLayout title="Azure Ad Login">
        <div className="flex gap-2">
          <span>UPN:</span>
          <Input value={azureLoginUPN} onChange={(value) => dispatch(setAzureLoginUPN(value))} />
        </div>
      </SettingLayout>
    </div>
  );
}
