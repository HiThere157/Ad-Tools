import { useEffect } from "react";
import { useSessionStorage } from "../Hooks/useStorage";

import { BsFillArrowUpCircleFill } from "react-icons/bs";

type ScrollPositionProps = {
  name: string;
};
export default function ScrollPosition({ name }: ScrollPositionProps) {
  const [scrollPos, setScrollPos] = useSessionStorage<number>(`${name}_scroll`, 0);
  const callback = ({ target }: Event) => {
    setScrollPos((target as HTMLElement).scrollTop ?? 0);
  };

  useEffect(() => {
    const scrollContainer = document.getElementById("js-scroll-container");
    scrollContainer?.addEventListener("scroll", callback);

    return () => {
      scrollContainer?.removeEventListener("scroll", callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const scrollTo = (height: number, smooth?: boolean) => {
    document
      .getElementById("js-scroll-container")
      ?.scrollTo({ top: height, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollTo(scrollPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute z-[30] bottom-5 right-8">
      {scrollPos > 200 && (
        <button
          className="text-4xl bg-darkBg text-elAccentBg hover:text-elActiveBg rounded-full"
          onClick={() => {
            scrollTo(0, true);
          }}
        >
          <BsFillArrowUpCircleFill />
        </button>
      )}
    </div>
  );
}
