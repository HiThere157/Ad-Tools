import PulseLoader from "react-spinners/PulseLoader";

type LoaderProps = {
  isVisible: boolean;
};
export default function Loader({ isVisible }: LoaderProps) {
  return (
    <>
      {isVisible && (
        <div className="flex justify-center items-center my-3">
          <PulseLoader size="12px" color="#208CF0" speedMultiplier={0.75} />
        </div>
      )}
    </>
  );
}
