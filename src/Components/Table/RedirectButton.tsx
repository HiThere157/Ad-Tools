import Button from "../Button";

import { BsSearch } from "react-icons/bs"

type RedirectButtonProps = {
  isVisible: boolean,
  onClick: Function
}
export default function RedirectButton({ isVisible, onClick }: RedirectButtonProps) {
  return (
    <>
      {isVisible && (
        <Button
          onClick={onClick}
          classOverride="absolute right-2 top-1/2 translate-y-[-50%] p-1 scale-0 group-hover:scale-100"
        >
          <BsSearch />
        </Button>
      )}
    </>
  );
}
