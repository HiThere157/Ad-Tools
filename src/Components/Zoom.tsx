import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { electronWindow } from "../Helper/api";
import { setZoom } from "../Redux/preferences";

export default function Zoom() {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>();
  const { zoom } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey) {
        const newZoom = zoom + (e.deltaY > 0 ? -0.1 : 0.1);
        const clampedZoom = Math.min(Math.max(newZoom, 0.5), 1);

        dispatch(setZoom(clampedZoom));
        setVisible(true);

        const id = window.setTimeout(() => {
          setVisible(false);
        }, 1500);

        if (timeoutId) clearTimeout(timeoutId);
        setTimeoutId(id);
      }
    },
    [dispatch, timeoutId, zoom],
  );

  // Handle zoom events
  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    electronWindow.electronAPI?.setZoom(zoom);
  }, [zoom]);

  if (!visible || !zoom) return null;

  return (
    <div className="absolute left-1/2 top-1/2 z-50 translate-x-[-50%] translate-y-[-50%] rounded border-2 border-border bg-dark p-2">
      <span className="text-lg">{Math.round(zoom * 100)}%</span>
    </div>
  );
}
