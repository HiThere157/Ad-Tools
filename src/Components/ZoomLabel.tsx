import { useEffect, useState } from "react";

import { electronAPI } from "../Helper/makeAPICall";

export default function ZoomLabel() {
  const [visible, setVisibility] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>();
  const [timeoutId, setTimeoutId] = useState<number>(0);

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisibility(true);
    setTimeoutId(
      window.setTimeout(() => {
        setVisibility(false);
      }, 1500),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  useEffect(() => {
    electronAPI?.handleZoomUpdate((value: number) => {
      setZoom(Math.round(value * 100));
    });
    return () => {
      electronAPI?.removeZoomListener();
    };
  }, []);

  return (
    <>
      {visible && zoom && (
        <div className="container absolute z-[60] top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] p-3">
          <span className="text-lg">{zoom}%</span>
        </div>
      )}
    </>
  );
}
