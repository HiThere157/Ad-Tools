import { useEffect, useState } from "react"

import { ElectronAPI } from "../Types/api";

export default function Footer() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { output } = await (window as ElectronAPI).electronAPI.getVersion();
        setVersion(output);
      } catch {
        setVersion("");
      }
    })();
  }, []);

  return (
    <footer style={{ gridArea: "footer" }} className="flex justify-center text-xs dark:text-foregroundAccent dark:bg-secondaryBg">
      {version && <span className="m-1">v{version}</span>}
    </footer>
  );
}