import { ClipLoader } from "react-spinners";
import { BsExclamationOctagon, BsCheckCircle } from "react-icons/bs";

type ModuleStatusProps = {
  version?: string | null;
};
export default function ModuleStatus({ version }: ModuleStatusProps) {
  if (version === undefined)
    return <ClipLoader size="19px" color="#208CF0" speedMultiplier={0.5} />;
  if (version === null) return <BsExclamationOctagon className="text-lg text-redColor" />;
  if (version) return <BsCheckCircle className="text-lg text-whiteColorAccent" />;

  return <></>;
}
