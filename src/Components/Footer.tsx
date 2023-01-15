import { useEffect, useState } from "react";

import { electronAPI } from "../Helper/makeAPICall";

export default function Footer() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getVersion();
      setVersion(result?.output?.version ?? "");
    })();
  }, []);

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center text-xs dark:text-whiteColorAccent dark:bg-lightBg"
    >
      {version && <span className="m-1">v{version}</span>}
    </footer>
  );
}
