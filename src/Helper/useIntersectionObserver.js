import { useEffect, useRef } from "react";

export default function useIntersectionObserver(headings, setActive) {
  const elements = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headings.forEach((heading) => {
        elements.current[heading.target.getAttribute("data-section-index")] =
          heading;
      });

      const visible = Object.values(elements.current)
        .filter(({ isIntersecting }) => isIntersecting)
        .sort((a, b) => {
          return b.intersectionRect.height - a.intersectionRect.height;
        });

      if(visible.length !== 0){
        setActive(Number(visible[0].target.getAttribute("data-section-index")));
      }
    };

    const range = (from, to, step) =>
      [...Array(Math.floor((to - from) / step) + 1)].map(
        (_, i) => from + i * step
      );

    const observer = new IntersectionObserver(callback, {
      threshold: range(0, 1, 0.01),
    });

    headings
      .map((heading) => heading.parentElement.parentElement)
      .forEach((element, index) => {
        element.setAttribute("data-section-index", index);
        observer.observe(element);
      });

    return () => {
      observer.disconnect();
    };
  }, [headings, setActive]);
}
