import {
  BsExclamationOctagon,
  BsCloudArrowDown,
  BsCheckCircle,
  BsForwardFill,
} from "react-icons/bs";
import { ClipLoader, PulseLoader } from "react-spinners";

type AppVersionProps = {
  app: string;
  currentVersion: string;
  downloadStatus: UpdateDownloadStatus;
};
export default function AppVersion({ app, currentVersion, downloadStatus }: AppVersionProps) {
  const { status, version: updateVersion } = downloadStatus ?? {};

  return (
    <div className="flex items-center justify-between">
      <div className="flex">
        <span>{app}</span>

        <div className="mx-1.5 flex items-center gap-1.5 text-sm text-grey">
          {currentVersion && <span>{currentVersion}</span>}

          {updateVersion && status !== "upToDate" && (
            <>
              <BsForwardFill />
              <span>{updateVersion}</span>
            </>
          )}
        </div>
      </div>

      {downloadStatus === null && <PulseLoader color="#208cf0" speedMultiplier={0.7} size={7} />}
      {status === "pending" && <ClipLoader color="#208cf0" speedMultiplier={0.5} size={16} />}
      {status === "complete" && <BsCloudArrowDown className="text-xl text-green" />}
      {status === "error" && <BsExclamationOctagon className="text-xl text-red" />}
      {status === "upToDate" && <BsCheckCircle className="text-xl text-green" />}
    </div>
  );
}
