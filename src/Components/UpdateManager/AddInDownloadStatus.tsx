import Title from "../Title";

import { PulseLoader, ClipLoader } from "react-spinners";
import { BsExclamationOctagon, BsCheckCircle, BsSlashCircle, BsDashCircle } from "react-icons/bs";

type AddInDownloadStatusProps = {
  status?: AddInDownloadStatus;
};
export default function AddInDownloadStatus({ status }: AddInDownloadStatusProps) {
  switch (status) {
    case undefined:
      return (
        <Title text="Loading" position="left">
          <PulseLoader size="6px" color="#208CF0" speedMultiplier={0.5} />
        </Title>
      );
    case "notAvailable":
      return (
        <Title classList="h-[19px]" text="Not Available" position="left">
          <BsSlashCircle className="text-lg text-whiteColorAccent" />
        </Title>
      );
    case "pending":
      return (
        <Title classList="h-[19px]" text="Downloading" position="left">
          <ClipLoader size="19px" color="#208CF0" speedMultiplier={0.5} />
        </Title>
      );
    case "error":
      return (
        <Title text="Error" position="left">
          <BsExclamationOctagon className="text-lg text-redColor" />
        </Title>
      );
    case "notInstalled":
      return (
        <Title text="Not Installed" position="left">
          <BsDashCircle className="text-lg text-whiteColorAccent" />
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
