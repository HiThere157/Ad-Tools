import { useSelector } from "react-redux";

import { RootState } from "../Redux/store";

export default function Footer() {
  const { appVersion } = useSelector((state: RootState) => state.environment.electron);

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center bg-light p-1 text-xs text-grey"
    >
      <span>{appVersion}</span>
    </footer>
  );
}
