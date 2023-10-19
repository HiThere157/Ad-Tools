import Button from "../Button";

import { BsX } from "react-icons/bs";

type PopupProps = {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  children: React.ReactNode;
};
export default function Popup({ isOpen, title, onCancel, children }: PopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="absolute inset-0 z-40 bg-dark opacity-90" onClick={onCancel} />

      <div className="absolute left-1/2 top-1/3 z-40 translate-x-[-50%] translate-y-[-50%] rounded border-2 border-border bg-dark">
        <div className="flex items-center justify-between border-b border-border bg-light p-2">
          <h3 className="text-lg font-bold">{title}</h3>

          <Button className="bg-dark p-0.5 text-xl" onClick={onCancel}>
            <BsX />
          </Button>
        </div>

        <div className="p-2">{children}</div>
      </div>
    </>
  );
}
