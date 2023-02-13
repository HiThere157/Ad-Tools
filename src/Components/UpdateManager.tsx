import { useEffect, useState, useRef } from "react";

import { electronAPI } from "../Helper/makeAPICall";
import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import WinButton from "./WinBar/WinButton";
import Button from "./Button";

import { ClipLoader } from "react-spinners";
import {
  BsDownload,
  BsCircleFill,
  BsArrowRepeat,
  BsExclamationOctagon,
  BsCheckCircle,
  BsCloudArrowDown,
  BsFillForwardFill,
} from "react-icons/bs";
import Link from "./Link";

export default function UpdateManager() {
  const { setState } = useGlobalState();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<DownloadStatus>("upToDate");

  const [version, setVersion] = useState<string>("");
  const [latestVersion, setLatestVersion] = useState<string>("");

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

  const fetchInfo = async () => {
    const result = await electronAPI?.getVersion();
    const updateResult = await electronAPI?.checkForUpdate();

    setVersion(result?.output?.version ?? "");
    setLatestVersion(updateResult?.version ?? "");
  };

  useEffect(() => {
    fetchInfo();

    electronAPI?.handleDownloadStatusUpdate((status: DownloadStatus) => {
      setStatus(status);
      if (status === "complete")
        addMessage(
          { type: "info", message: "Update Download complete. Restart to apply", timer: 7 },
          setState,
        );
      if (status === "error")
        addMessage(
          { type: "error", message: "An Error occured while downloading an Update" },
          setState,
        );
      if (status === "pending")
        addMessage({ type: "info", message: "Download for an Update started", timer: 7 }, setState);
    });
    return () => {
      electronAPI?.removeDownloadStatusUpdate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (version === latestVersion) {
      setStatus("upToDate");
    }
  }, [version, latestVersion]);

  const refreshInfo = () => {
    fetchInfo();
    addMessage({ type: "info", message: "Checking for Updates", timer: 7 }, setState);
  };

  return (
    <div ref={ref} className="z-[20]">
      <WinButton classOverride="relative" onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />
        {status !== "upToDate" && (
          <BsCircleFill className="absolute top-0.5 right-1 text-xs text-redColor" />
        )}
      </WinButton>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <UpdateManagerBody
          status={status}
          version={version}
          latestVersion={latestVersion}
          onRefresh={refreshInfo}
        />
      </div>
    </div>
  );
}

type UpdateManagerBodyProps = {
  status: DownloadStatus;
  version: string;
  latestVersion: string;
  onRefresh: () => any;
};
function UpdateManagerBody({ status, version, latestVersion, onRefresh }: UpdateManagerBodyProps) {
  return (
    <div className="container absolute right-0 w-max mt-1 p-1">
      <div className="flex items-center justify-between">
        <span className="block text-xl ml-1 mr-10">Update Manager</span>
        <Button classOverride="p-1.5" onClick={onRefresh}>
          <BsArrowRepeat />
        </Button>
      </div>
      <hr className="my-1 dark:border-elFlatBorder"></hr>
      <div className="px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="https://github.com/HiThere157/Ad-Tools">AD Tools</Link>
            <div className="flex items-center text-whiteColorAccent text-xs ml-3">
              {version && <span>v{version}</span>}
              {version && latestVersion && version !== latestVersion && (
                <>
                  <BsFillForwardFill className="mx-2" />
                  <span>v{latestVersion}</span>
                </>
              )}
            </div>
          </div>

          {status === "pending" && <ClipLoader size="19px" color="#208CF0" speedMultiplier={0.5} />}
          {status === "error" && <BsExclamationOctagon className="text-lg text-redColor" />}
          {status === "complete" && <BsCloudArrowDown className="text-lg text-greenColor" />}
          {status === "upToDate" && <BsCheckCircle className="text-lg text-elAccentBg" />}
        </div>
      </div>
    </div>
  );
}
