import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setAzureLoginUPN, setQueryDomains, setZoom } from "../Redux/preferencesSlice";
import { downloadJSON, uploadJSON } from "../Helper/file";

import SettingLayout from "../Layout/SettingLayout";
import Input from "../Components/Input/Input";
import Button from "../Components/Button";
import EditList from "../Components/EditList";
import Confirm from "../Components/Popup/Confirm";

import { BsDashLg, BsDownload, BsPlusLg, BsUpload } from "react-icons/bs";

export default function Settings() {
  const [isPersistDeleteOpen, setIsPersistDeleteOpen] = useState(false);
  const { queryDomains, azureLoginUPN, zoom } = useSelector(
    (state: RootState) => state.preferences,
  );
  const dispatch = useDispatch();

  return (
    <div className="grid w-fit grid-cols-2 px-4 py-2">
      <SettingLayout title="Query Domains">
        <EditList list={queryDomains} onChange={(list) => dispatch(setQueryDomains(list))} />
      </SettingLayout>

      <SettingLayout title="Storage">
        <div className="flex gap-2">
          <div>
            <Button className="text-red" onClick={() => window.location.reload()}>
              Clear Volatile
            </Button>

            <ul className="mt-2 px-2 [&>li]:leading-5">
              <li>Tabs</li>
              <li>Results</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <Button className="text-red" onClick={() => setIsPersistDeleteOpen(true)}>
              Clear Persistent
            </Button>

            <div className="mt-1 flex items-start gap-1">
              <Button
                className="flex w-full justify-center py-1"
                onClick={async () => {
                  const string = await uploadJSON();
                  window.localStorage.setItem("persist:root", string);
                  window.location.reload();
                }}
              >
                <BsUpload />
              </Button>
              <Button
                className="flex w-full justify-center py-1"
                onClick={() => {
                  const string = window.localStorage.getItem("persist:root") || "{}";
                  downloadJSON(string, "preferences.json");
                }}
              >
                <BsDownload />
              </Button>
            </div>

            <ul className="mt-2 px-2 [&>li]:leading-5">
              <li>Preferences</li>
              <li>Query Domains</li>
              <li>Filter Presets</li>
              <li>Custom Table Columns</li>
              <li>Azure Login UPN</li>
            </ul>
          </div>
        </div>
      </SettingLayout>

      <SettingLayout title="Azure Ad Login">
        <div className="flex gap-2">
          <span>UPN:</span>
          <Input value={azureLoginUPN} onChange={(upn) => dispatch(setAzureLoginUPN(upn))} />
        </div>
      </SettingLayout>

      <SettingLayout title="Zoom">
        <div className="flex gap-2">
          <span>Zoom:</span>
          <Button
            onClick={() => dispatch(setZoom(zoom - 0.1))}
            disabled={Math.round(zoom * 100) <= 50}
            className="p-1"
          >
            <BsDashLg />
          </Button>
          <span className="mx-2">{Math.round(zoom * 100)}%</span>
          <Button
            onClick={() => dispatch(setZoom(zoom + 0.1))}
            disabled={Math.round(zoom * 100) >= 100}
            className="p-1"
          >
            <BsPlusLg />
          </Button>
        </div>
      </SettingLayout>

      <Confirm
        isOpen={isPersistDeleteOpen}
        title="Delete Persistent Data"
        message="Are you sure you want to delete all the persisted data? This will also delete all volatile data (tabs, results)."
        onExit={(selection) => {
          setIsPersistDeleteOpen(false);

          if (selection) {
            window.localStorage.removeItem("persist:root");
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
