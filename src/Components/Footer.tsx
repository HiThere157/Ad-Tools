import { useEffect, useState } from "react";

import { electronAPI } from "../Helper/makeAPICall";

export default function Footer() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getAppVersion();
      setVersion(result?.output?.version ?? "");
    })();
  }, []);

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center text-xs text-whiteColorAccent bg-lightBg"
    >
      {version && <span className="m-1">v{version}</span>}
    </footer>
  );
}
