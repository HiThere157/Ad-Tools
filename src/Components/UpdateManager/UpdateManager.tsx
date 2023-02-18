import { useEffect, useState, useRef } from "react";

import { electronAPI } from "../../Helper/makeAPICall";
import { useGlobalState } from "../../Hooks/useGlobalState";
import { addMessage, removeMessage } from "../../Helper/handleMessage";

import WinButton from "../WinBar/WinButton";
import Button from "../Button";
import Link from "../Link";
import ModuleStatus from "./ModuleStatus";
import DownloadStatus from "./DownloadStatus";
import VersionLabel from "./VersionLabel";

import { BsDownload, BsCircleFill, BsArrowRepeat } from "react-icons/bs";

export default function UpdateManager() {
  const { setState } = useGlobalState();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [appStatus, setAppStatus] = useState<DownloadStatus>();
  const [appVersion, setAppVersion] = useState<CurrentVersionInfo>({});

  const [modVersion, setModVersion] = useState<ModuleVersion>();

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const fetchInfo = () => {
    (async () => {
      setAppStatus(undefined);
      // improve UX by preventing only split second visibility of the loading animation
      await new Promise((r) => setInterval(r, 1000));

      const versionResult = (await electronAPI?.getAppVersion())?.output?.version;
      const latestVersionResult = (await electronAPI?.checkForAppUpdate())?.output?.version;

      if (versionResult && versionResult === latestVersionResult) setAppStatus("upToDate");

      setAppVersion({
        current: versionResult,
        latest: latestVersionResult,
      });
    })();

    (async () => {
      setModVersion(undefined);
      const modVersionResult = (await electronAPI?.getModuleVersion())?.output;

      setModVersion(modVersionResult);
    })();
  };

  useEffect(() => {
    fetchInfo();

    electronAPI?.handleAppDownloadStatusUpdate((newStatus: DownloadStatus) => {
      setAppStatus(newStatus);
      switch (newStatus) {
        case "complete":
          addMessage(
            { type: "info", message: "Update Download complete. Restart to apply", timer: 7 },
            setState,
          );
          return removeMessage({ key: "updateDownloadStart" }, setState);
        case "error":
          return addMessage(
            { type: "error", message: "An Error occured while downloading an Update" },
            setState,
          );
        case "pending":
          return addMessage(
            { type: "info", key: "updateDownloadStart", message: "Download for an Update started" },
            setState,
          );
      }
    });

    return () => {
      electronAPI?.removeAppDownloadStatusUpdate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className="z-[20]">
      <WinButton classList="relative" onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />
        {appStatus && appStatus !== "upToDate" && (
          <BsCircleFill className="absolute top-0.5 right-1 text-xs text-redColor" />
        )}
      </WinButton>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <UpdateManagerBody
          appStatus={appStatus}
          appVersion={appVersion}
          modVersion={modVersion}
          onRefresh={fetchInfo}
        />
      </div>
    </div>
  );
}

type UpdateManagerBodyProps = {
  appStatus?: DownloadStatus;
  appVersion: CurrentVersionInfo;
  modVersion?: ModuleVersion;
  onRefresh: () => any;
};
function UpdateManagerBody({
  appStatus,
  appVersion,
  modVersion,
  onRefresh,
}: UpdateManagerBodyProps) {
  return (
    <div className="container absolute right-0 w-max mt-1 p-1">
      <div className="flex items-center justify-between">
        <span className="block text-xl ml-1 mr-10">Update Manager</span>
        <Button classList="p-1.5" onClick={onRefresh}>
          <BsArrowRepeat />
        </Button>
      </div>

      <hr className="my-1 dark:border-elFlatBorder"></hr>

      <div className="flex items-center justify-between mx-1">
        <div className="flex items-baseline">
          <Link href="https://github.com/HiThere157/Ad-Tools">AD-Tools</Link>
          <VersionLabel version1={appVersion.current} version2={appVersion.latest} />
        </div>
        <DownloadStatus status={appStatus} />
      </div>

      <hr className="my-1 dark:border-elFlatBorder"></hr>

      <div className="flex items-center justify-between mx-1">
        <div className="flex items-baseline">
          <Link href="https://github.com/HiThere157/Ad-Tools/wiki/Installation">Azure AD</Link>
          <VersionLabel version1={modVersion?.azureAD} />
        </div>
        <ModuleStatus version={modVersion?.azureAD} />
      </div>
      <div className="flex items-center justify-between mx-1">
        <div className="flex items-baseline">
          <Link href="https://github.com/HiThere157/Ad-Tools/wiki/Installation">RSAT Tools</Link>
          <VersionLabel version1={modVersion?.activeDirectory} />
        </div>
        <ModuleStatus version={modVersion?.activeDirectory} />
      </div>
    </div>
  );
}
