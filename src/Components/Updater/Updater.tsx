import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { setPowershellEnvironment, setUpdateDownloadStatus } from "../../Redux/environment";
import { electronWindow, getPowershellEnvironment } from "../../Helper/api";
import { useClickAway } from "../../Hooks/useClickAway";

import HeaderButton from "../Header/HeaderButton";
import Button from "../Button";
import ModuleVersion from "./ModuleVersion";

import { BsArrowRepeat, BsDownload } from "react-icons/bs";
import AppVersion from "./AppVersion";

export default function Updater() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {
    electron: { appVersion },
    powershell: { adVersion, azureAdVersion },
    updateStatus,
  } = useSelector((state: RootState) => state.environment);
  const dispatch = useDispatch();

  useClickAway(ref, () => setIsOpen(false));

  const refresh = async () => {
    dispatch(setUpdateDownloadStatus(null));
    dispatch(setPowershellEnvironment({ adVersion: null, azureAdVersion: null }));

    electronWindow.electronAPI?.checkForUpdates();
    const powershellEnvironment = await getPowershellEnvironment();

    dispatch(setPowershellEnvironment(powershellEnvironment));
  };

  useEffect(() => {
    electronWindow.electronAPI?.onDownloadStatusUpdate((status) => {
      dispatch(setUpdateDownloadStatus(status));
    });

    return () => {
      electronWindow.electronAPI?.offDownloadStatusUpdate();
    };
  }, [dispatch]);

  return (
    <div ref={ref} className="winbar-no-drag relative">
      <HeaderButton className="relative" onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />

        {updateStatus && updateStatus.status !== "upToDate" && (
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red" />
        )}
      </HeaderButton>

      {isOpen && (
        <div className="absolute right-0 top-9 z-40 w-60 rounded border-2 border-border bg-dark drop-shadow-custom">
          <div className="flex items-center justify-between border-b border-border bg-light p-2">
            <h3 className="text-lg font-bold">Update Manager</h3>

            <Button className="bg-dark p-0.5 text-xl" onClick={refresh}>
              <BsArrowRepeat />
            </Button>
          </div>

          <div className="p-2">
            <AppVersion app="Ad-Tools" currentVersion={appVersion} downloadStatus={updateStatus} />

            <div className="my-1.5 border-t border-border" />

            <ModuleVersion module="ActiveDirectory" version={adVersion} />
            <ModuleVersion module="AzureAD" version={azureAdVersion} />
          </div>
        </div>
      )}
    </div>
  );
}
