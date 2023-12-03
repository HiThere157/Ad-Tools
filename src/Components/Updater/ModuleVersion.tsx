import { BsExclamationOctagon, BsCheckCircle } from "react-icons/bs";

type ModuleVersionProps = {
  module: string;
  version: string;
};
export default function ModuleVersion({ module, version }: ModuleVersionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="">{module}</span>
        <span className="mx-1.5 text-sm text-grey">{version}</span>
      </div>

      {version ? (
        <BsCheckCircle className="text-lg text-green" />
      ) : (
        <BsExclamationOctagon className="text-xl text-red" />
      )}
    </div>
  );
}
