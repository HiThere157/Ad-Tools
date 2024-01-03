import { useEffect, useState } from "react";

import { electronWindow } from "../Helper/api";

export default function Zoom() {
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [timeoutId, setTimeoutId] = useState<number>();

  useEffect(() => {
    electronWindow.electronAPI?.onZoom((zoom) => {
      setVisible(true);
      setZoom(zoom);

      const id = window.setTimeout(() => {
        setVisible(false);
      }, 1500);

      if (timeoutId) clearTimeout(timeoutId);
      setTimeoutId(id);
    });

    return () => {
      electronWindow.electronAPI?.offZoom();
    };
  }, [timeoutId]);

  if (!visible || !zoom) return null;

  return (
    <div className="absolute left-1/2 top-1/2 z-50 translate-x-[-50%] translate-y-[-50%] rounded border-2 border-border bg-dark p-2">
      <span className="text-lg">{Math.round(zoom * 100)}%</span>
    </div>
  );
}
