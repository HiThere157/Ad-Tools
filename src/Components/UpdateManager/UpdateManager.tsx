import { useEffect, useState, useRef } from "react";

import { electronAPI } from "../../Helper/makeAPICall";
import { useGlobalState } from "../../Hooks/useGlobalState";
import { addMessage, removeMessage } from "../../Helper/handleMessage";

import WinButton from "../WinBar/WinButton";
import Button from "../Button";
import Link from "../Link";
import ModuleStatus from "./ModuleStatus";
import DownloadStatus from "./DownloadStatus";

import { BsDownload, BsCircleFill, BsArrowRepeat, BsFillForwardFill } from "react-icons/bs";

export default function UpdateManager() {
  const { setState } = useGlobalState();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<DownloadStatus>();

  const [version, setVersion] = useState<string>();
  const [latestVersion, setLatestVersion] = useState<string>();
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
      setStatus(undefined);
      const versionResult = (await electronAPI?.getVersion())?.output?.version;
      const latestVersionResult = (await electronAPI?.checkForUpdate())?.output?.version;

      // improve UX by preventing only split second visibility of the loading animation
      await new Promise((r) => setInterval(r, 1000));

      if (versionResult && versionResult === latestVersionResult) setStatus("upToDate");
      setVersion(versionResult);
      setLatestVersion(latestVersionResult);
    })();

    (async () => {
      setModVersion(undefined);
      const modVersionResult = await electronAPI?.getModuleVersion();

      setModVersion(modVersionResult?.output);
    })();
  };

  useEffect(() => {
    fetchInfo();

    electronAPI?.handleDownloadStatusUpdate((newStatus: DownloadStatus) => {
      setStatus(newStatus);
      if (newStatus === "complete") {
        addMessage(
          { type: "info", message: "Update Download complete. Restart to apply", timer: 7 },
          setState,
        );
        removeMessage({ key: "updateDownloadStart" }, setState);
      }

      if (newStatus === "error") {
        addMessage(
          { type: "error", message: "An Error occured while downloading an Update" },
          setState,
        );
      }

      if (newStatus === "pending") {
        addMessage(
          { type: "info", key: "updateDownloadStart", message: "Download for an Update started" },
          setState,
        );
      }
    });
    return () => {
      electronAPI?.removeDownloadStatusUpdate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshInfo = () => {
    fetchInfo();
    addMessage({ type: "info", message: "Checking for Updates", timer: 7 }, setState);
  };

  return (
    <div ref={ref} className="z-[20]">
      <WinButton classList="relative" onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />
        {status && status !== "upToDate" && (
          <BsCircleFill className="absolute top-0.5 right-1 text-xs text-redColor" />
        )}
      </WinButton>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <UpdateManagerBody
          status={status}
          version={version}
          modVersion={modVersion}
          latestVersion={latestVersion}
          onRefresh={refreshInfo}
        />
      </div>
    </div>
  );
}

type UpdateManagerBodyProps = {
  status?: DownloadStatus;
  version?: string;
  modVersion?: ModuleVersion;
  latestVersion?: string;
  onRefresh: () => any;
};
function UpdateManagerBody({
  status,
  version,
  modVersion,
  latestVersion,
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
          <div className="flex items-center text-whiteColorAccent text-xs ml-2">
            {version && <span>v{version}</span>}
            {version && latestVersion && version !== latestVersion && (
              <>
                <BsFillForwardFill className="mx-2" />
                <span>v{latestVersion}</span>
              </>
            )}
          </div>
        </div>
        <DownloadStatus status={status} />
      </div>

      <hr className="my-1 dark:border-elFlatBorder"></hr>

      <div className="flex items-center justify-between mx-1">
        <div className="flex items-baseline">
          <Link href="https://github.com/HiThere157/Ad-Tools/wiki/Installation">Azure AD</Link>
          <div className="flex items-center text-whiteColorAccent text-xs ml-2">
            {modVersion?.azureAD && <span>v{modVersion.azureAD}</span>}
          </div>
        </div>
        <ModuleStatus version={modVersion?.azureAD} />
      </div>
      <div className="flex items-center justify-between mx-1">
        <div className="flex items-baseline">
          <Link href="https://github.com/HiThere157/Ad-Tools/wiki/Installation">RSAT Tools</Link>
          <div className="flex items-center text-whiteColorAccent text-xs ml-2">
            {modVersion?.activeDirectory && <span>v{modVersion.activeDirectory}</span>}
          </div>
        </div>
        <ModuleStatus version={modVersion?.activeDirectory} />
      </div>
    </div>
  );
}
