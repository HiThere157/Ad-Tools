import Title from "../Title";

import { ClipLoader, PulseLoader } from "react-spinners";
import { BsExclamationOctagon, BsCheckCircle, BsCloudArrowDown } from "react-icons/bs";

type DownloadStatusProps = {
  status?: DownloadStatus;
};
export default function DownloadStatus({ status }: DownloadStatusProps) {
  switch (status) {
    case undefined:
      return (
        <Title text="Loading" position="left">
          <PulseLoader size="8px" color="#208CF0" speedMultiplier={0.5} />
        </Title>
      );
    case "pending":
      return (
        <Title text="Downloading" position="left">
          <ClipLoader size="19px" color="#208CF0" speedMultiplier={0.5} />
        </Title>
      );
    case "error":
      return (
        <Title text="Error" position="left">
          <BsExclamationOctagon className="text-lg text-redColor" />
        </Title>
      );
    case "complete":
      return (
        <Title text="Download Complete" position="left">
          <BsCloudArrowDown className="text-lg text-greenColor" />
        </Title>
      );
    case "upToDate":
      return (
        <Title text="Up To Date" position="left">
          <BsCheckCircle className="text-lg text-elAccentBg" />
        </Title>
      );

    default:
      return <></>;
  }
}
