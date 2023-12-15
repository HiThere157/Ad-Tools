import { useEffect, useState } from "react";

import { electronWindow } from "../Helper/api";

export default function Zoom() {
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [timeoutId, setTimeoutId] = useState<number>();

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setVisible(true);
    const id = window.setTimeout(() => {
      setVisible(false);
    }, 1500);

    setTimeoutId(id);
  }, [zoom]);

  useEffect(() => {
    electronWindow.electronAPI?.onZoom((zoom) => {
      setZoom(zoom);
    });

    return () => {
      electronWindow.electronAPI?.offZoom();
    };
  }, []);

  return (
    <>
      {visible && zoom && (
        <div className="absolute left-1/2 top-1/2 z-50 translate-x-[-50%] translate-y-[-50%] rounded border-2 border-border bg-dark p-2">
          <span className="text-lg">{Math.round(zoom * 100)}%</span>
        </div>
      )}
    </>
  );
}
