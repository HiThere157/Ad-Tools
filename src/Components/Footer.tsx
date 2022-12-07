import { useEffect, useState } from "react";

import { electronAPI } from "../Helper/makeAPICall";

export default function Footer() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getVersion();
      setVersion(result?.output ?? "");
    })();
  }, []);

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center text-xs dark:text-foregroundAccent dark:bg-secondaryBg"
    >
      {version && <span className="m-1">v{version}</span>}
    </footer>
  );
}
