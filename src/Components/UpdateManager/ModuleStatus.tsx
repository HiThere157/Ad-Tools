import Title from "../Title";

import { PulseLoader } from "react-spinners";
import { BsExclamationOctagon, BsCheckCircle } from "react-icons/bs";

type ModuleStatusProps = {
  version?: string | null;
};
export default function ModuleStatus({ version }: ModuleStatusProps) {
  switch (version) {
    case undefined:
      return (
        <Title text="Loading" position="right">
          <PulseLoader size="6px" color="#208CF0" speedMultiplier={0.5} />
        </Title>
      );
    case null:
      return (
        <Title text="Not Installed" position="right">
          <BsExclamationOctagon className="text-lg text-redColor" />
        </Title>
      );

    default:
      return (
        <Title text="Installed" position="right">
          <BsCheckCircle className="text-lg text-whiteColorAccent" />
        </Title>
      );
  }
}
