import { BsExclamationOctagon, BsCheckCircle } from "react-icons/bs";

type ModuleStatusProps = {
  version: string | null;
};
export default function ModuleStatus({ version }: ModuleStatusProps) {
  return (
    <>
      {version ? (
        <BsCheckCircle className="text-lg text-whiteColorAccent" />
      ) : (
        <BsExclamationOctagon className="text-lg text-redColor" />
      )}
    </>
  );
}
