import { useEffect, useState } from "react";

import { defaultEnvironment } from "../Config/default";
import { getEnvironment } from "../Helper/api";

export default function Footer() {
  const [env, setEnv] = useState<ElectronEnvironment>(defaultEnvironment);

  useEffect(() => {
    getEnvironment().then(setEnv);
  }, []);

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center bg-light p-1 text-xs text-grey"
    >
      <span>{env.appVersion}</span>
    </footer>
  );
}
