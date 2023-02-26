type TitleProps = {
  children: React.ReactNode;
  text: string;
  position: "right" | "bottom" | "top";
  className?: string;
};
export default function Title({ children, text, position, className = "" }: TitleProps) {
  const containerClasses = "absolute peer-hover:scale-100 scale-0 z-[15]";
  const accentClasses = "absolute h-2 w-2 rounded-sm bg-elBg rotate-45";
  const textClasses = "rounded bg-elBg text-sm px-1.5 whitespace-pre";

  return (
    <div className={"relative inline-block" + className}>
      <div className="inline-block peer align-middle">{children}</div>
      {position === "right" && (
        <div
          className={
            "top-1/2 right-0 translate-y-[-50%] translate-x-[100%] pl-2 " + containerClasses
          }
        >
          <div className={"top-1/2 left-1 translate-y-[-50%] " + accentClasses} />
          <div className={textClasses}>{text}</div>
        </div>
      )}
      {position === "bottom" && (
        <div
          className={
            "bottom-0 right-1/2 translate-y-[100%] translate-x-[50%] pt-2 " + containerClasses
          }
        >
          <div className={"top-1 left-1/2 translate-x-[-50%] " + accentClasses} />
          <div className={textClasses}>{text}</div>
        </div>
      )}
      {position === "top" && (
        <div
          className={
            "top-0 right-1/2 translate-y-[-100%] translate-x-[50%] pb-2 " + containerClasses
          }
        >
          <div className={"bottom-1 left-1/2 translate-x-[-50%] " + accentClasses} />
          <div className={textClasses}>{text}</div>
        </div>
      )}
    </div>
  );
}
