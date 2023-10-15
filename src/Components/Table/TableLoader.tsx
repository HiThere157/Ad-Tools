import { PulseLoader } from "react-spinners";

export default function TableLoader() {
  return (
    <div className="flex min-h-[3rem] items-center justify-center">
      <PulseLoader color="#208cf0" speedMultiplier={0.7} size={13} />
    </div>
  );
}
