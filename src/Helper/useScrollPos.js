import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "./useStorage";

export default function useScrollPos(parentRef, name) {
  const { pathname } = useLocation();
  const [scrollPos, setScrollPos] = useSessionStorage(name, 0);

  useEffect(() => {
    const callback = (event) => {
      setScrollPos(event.target.scrollTop);
    };

    const containerRef = parentRef.current.parentElement;
    containerRef.addEventListener("scroll", callback);

    return () => {
      containerRef.removeEventListener("scroll", callback);
    };
  }, [parentRef, name, setScrollPos]);

  useEffect(() => {
    parentRef.current.parentElement.scrollTo(0, scrollPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
