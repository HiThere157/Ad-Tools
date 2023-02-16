type TitleProps = {
  children: React.ReactNode;
  text: string;
  position: "left" | "bottom";
};
export default function Title({ children, text, position }: TitleProps) {
  return (
    <div className="relative group">
      {children}
      {position === "left" && (
        <div className="absolute top-1/2 right-0 translate-y-[-50%] translate-x-[100%] pl-2 group-hover:scale-100 scale-0">
          <div className="absolute h-2 w-2 rounded-sm dark:bg-elBg top-1/2 left-1 translate-y-[-50%] rotate-45" />
          <div className="rounded dark:bg-elBg text-sm text-whiteColorAccent px-1.5 whitespace-nowrap">
            {text}
          </div>
        </div>
      )}
      {position === "bottom" && (
        <div className="absolute bottom-0 right-1/2 translate-y-[100%] translate-x-[50%] pt-2 group-hover:scale-100 scale-0">
          <div className="absolute h-2 w-2 rounded-sm dark:bg-elBg top-1 left-1/2 translate-x-[-50%] rotate-45" />
          <div className="rounded dark:bg-elBg text-sm text-whiteColorAccent px-1.5 whitespace-nowrap">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}