import PulseLoader from "react-spinners/PulseLoader";

export default function Loader({ isVisible }) {
  return (
    <PulseLoader
      size="12px"
      color="#208CF0"
      loading={isVisible}
      speedMultiplier="0.75"
    />
  );
}
