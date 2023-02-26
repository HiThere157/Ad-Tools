import Button from "../Button";

import { BsXLg } from "react-icons/bs";

type PopupProps = {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  className?: string;
  onExit: () => any;
};
export default function Popup({ children, isOpen, title, className = "", onExit }: PopupProps) {
  return (
    <>
      {isOpen && (
        <div className="[&>*]:z-[50]">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 opacity-80 bg-darkBg"
            onClick={onExit}
          />
          <div
            className={
              "absolute container top-1/4 left-1/2 translate-x-[-50%] w-[25rem] py-1 " + className
            }
          >
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mx-2">{title}</h1>
              <Button className="p-1.5" onClick={onExit}>
                <BsXLg />
              </Button>
            </div>
            <hr className="my-1 border-elFlatBorder"></hr>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
