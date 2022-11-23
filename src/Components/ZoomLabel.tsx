import { useEffect, useState } from "react";

import { ElectronAPI } from "../Helper/makeAPICall";

export default function ZoomLabel() {
  const [visible, setVisibility] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [timeoutId, setTimeoutId] = useState(0);

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId)
    setVisibility(true)
    setTimeoutId(window.setTimeout(() => { setVisibility(false) }, 1500))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  useEffect(() => {
    try {
      (window as ElectronAPI).electronAPI.handleZoomUpdate((value: number) => {
        setZoom(Math.round(value * 100))
      })
      return () => {
        (window as ElectronAPI).electronAPI.removeZoomListener()
      }
    } catch { }
  }, [])

  return (
    <>
      {visible && zoom ? <div className="container absolute bottom-5 right-5 p-3 z-10">
        <span className="text-xl">{zoom}%</span>
      </div> : ""}
    </>
  )
}