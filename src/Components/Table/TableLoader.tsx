import { PulseLoader } from "react-spinners";

export default function TableLoader() {
  return (
    <div className="my-[1.1rem] flex justify-center">
      <PulseLoader color="#208cf0" speedMultiplier={0.7} size={13} />
    </div>
  );
}
