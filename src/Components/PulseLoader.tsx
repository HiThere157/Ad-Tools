import PulseLoader from "react-spinners/PulseLoader";

type LoaderProps = {
  isVisible: boolean
}
export default function Loader({ isVisible }: LoaderProps) {
  return (
    <PulseLoader
      size="12px"
      color="#208CF0"
      loading={isVisible}
      speedMultiplier={0.75}
    />
  );
}
