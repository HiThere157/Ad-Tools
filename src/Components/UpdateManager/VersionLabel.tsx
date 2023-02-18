import { BsFillForwardFill } from "react-icons/bs";

type VersionLabelProps = {
  version1?: string | null;
  version2?: string | null;
};
export default function VersionLabel({ version1, version2 }: VersionLabelProps) {
  return (
    <div className="flex items-center text-whiteColorAccent text-xs ml-2">
      {version1 && <span>v{version1}</span>}
      {version1 && version2 && version1 !== version2 && (
        <>
          <BsFillForwardFill className="mx-2" />
          <span>v{version2}</span>
        </>
      )}
    </div>
  );
}
