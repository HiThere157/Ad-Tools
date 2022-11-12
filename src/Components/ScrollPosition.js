import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

export default function ScrollPosition({ name }) {
  const ref = useRef();
  const { pathname } = useLocation();
  const [scrollPos, setScrollPos] = useSessionStorage(`${name}_scroll`, 0);

  useEffect(() => {
    const callback = (event) => {
      setScrollPos(event.target.scrollTop);
    };

    const containerRef = ref?.current?.parentElement?.parentElement;
    containerRef?.addEventListener("scroll", callback);

    return () => {
      containerRef?.removeEventListener("scroll", callback);
    };
  }, [ref, name]);

  useEffect(() => {
    ref?.current?.parentElement?.parentElement.scrollTo(0, scrollPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <div ref={ref}></div>;
}
