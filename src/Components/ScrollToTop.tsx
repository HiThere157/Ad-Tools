import { useEffect, useState } from "react";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

type ScrollToTopProps = {
  scrollRef: React.RefObject<HTMLDivElement>;
};
export default function ScrollToTop({ scrollRef }: ScrollToTopProps) {
  const [showButton, setShowButton] = useState(false);

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const checkScrollTop = () => {
      const scrollTop = scrollRef.current?.scrollTop ?? 0;
      setShowButton(scrollTop > 250);
    };

    scrollRef.current?.addEventListener("scroll", checkScrollTop);
    return () => scrollRef.current?.removeEventListener("scroll", checkScrollTop);
  }, []);

  return (
    <div className="absolute bottom-5 right-8 z-30">
      {showButton && (
        <button
          className="rounded-full bg-dark text-4xl text-primaryAccent hover:text-primaryActive"
          onClick={scrollTop}
        >
          <BsFillArrowUpCircleFill />
        </button>
      )}
    </div>
  );
}
