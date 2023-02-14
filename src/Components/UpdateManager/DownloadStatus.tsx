import { ClipLoader } from "react-spinners";
import { BsExclamationOctagon, BsCheckCircle, BsCloudArrowDown } from "react-icons/bs";

type DownloadStatusProps = {
  status: DownloadStatus;
};
export default function DownloadStatus({ status }: DownloadStatusProps) {
  if (status === "pending") return <ClipLoader size="19px" color="#208CF0" speedMultiplier={0.5} />;
  if (status === "error") return <BsExclamationOctagon className="text-lg text-redColor" />;
  if (status === "complete") return <BsCloudArrowDown className="text-lg text-greenColor" />;
  if (status === "upToDate") return <BsCheckCircle className="text-lg text-elAccentBg" />;

  return <></>;
}
