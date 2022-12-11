import { useEffect, useRef } from "react";

export default function useIntersectionObserver(headings: HTMLHeadElement[], setActive: Function) {
  const elements = useRef<{ [key: number]: IntersectionObserverEntry }>({});
  useEffect(() => {
    const callback = (sections: IntersectionObserverEntry[]) => {
      sections.forEach((heading) => {
        const index = Number(heading.target.getAttribute("data-section-index"));
        if (!isNaN(index)) elements.current[index] = heading;
      });

      const visible = Object.values(elements.current).filter(
        ({ isIntersecting }) => isIntersecting,
      );

      if (visible.length !== 0) {
        setActive(Number(visible[0].target.getAttribute("data-section-index")));
      }
    };

    const range = (from: number, to: number, step: number) =>
      [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);

    const observer = new IntersectionObserver(callback, {
      threshold: range(0, 1, 0.01),
      rootMargin: "-20% 0px 0px 0px",
    });

    headings
      .map((heading) => heading.parentElement?.closest("section"))
      .forEach((element, index) => {
        element?.setAttribute("data-section-index", index.toString());
        if (element) observer.observe(element);
      });

    return () => {
      observer.disconnect();
    };
  }, [headings, setActive]);
}
