import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

type ScrollPositionProps = {
  name: string;
};
export default function ScrollPosition({ name }: ScrollPositionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [scrollPos, setScrollPos] = useSessionStorage<number>(
    `${name}_scroll`,
    0,
  );

  useEffect(() => {
    const callback = ({ target }: Event) => {
      setScrollPos((target as HTMLElement).scrollTop ?? 0);
    };

    const containerRef = ref?.current?.parentElement?.parentElement;
    containerRef?.addEventListener("scroll", callback);

    return () => {
      containerRef?.removeEventListener("scroll", callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, name]);

  useEffect(() => {
    ref?.current?.parentElement?.parentElement?.scrollTo(0, scrollPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <div ref={ref}></div>;
}
