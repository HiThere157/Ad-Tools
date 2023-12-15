import { BsExclamationOctagon, BsCheckCircle } from "react-icons/bs";
import { PulseLoader } from "react-spinners";

type ModuleVersionProps = {
  module: string;
  version: string | null;
};
export default function ModuleVersion({ module, version }: ModuleVersionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="">{module}</span>
        <span className="mx-1.5 text-sm text-grey">{version}</span>
      </div>

      {version === null && <PulseLoader color="#208cf0" speedMultiplier={0.7} size={7} />}

      {version === "" && <BsCheckCircle className="text-lg text-green" />}

      {version && <BsExclamationOctagon className="text-xl text-red" />}
    </div>
  );
}
