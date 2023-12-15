import { BsExclamationOctagon, BsCloudArrowDown, BsCheckCircle } from "react-icons/bs";
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
      <div>
        <span className="">{app}</span>

        {updateVersion && (
          <span className="mx-1.5 text-sm text-grey">
            {currentVersion} - {updateVersion}
          </span>
        )}
      </div>

      {downloadStatus === null && <PulseLoader color="#208cf0" speedMultiplier={0.7} size={7} />}
      {status === "pending" && <ClipLoader color="#208cf0" speedMultiplier={0.5} size={7} />}
      {status === "complete" && <BsCloudArrowDown className="text-lg text-green" />}
      {status === "error" && <BsExclamationOctagon className="text-xl text-red" />}
      {status === "upToDate" && <BsCheckCircle className="text-xl text-green" />}
    </div>
  );
}
