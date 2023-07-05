import HeaderButton from "./HeaderButton";

import { BsDashLg, BsSquare, BsXLg } from "react-icons/bs";

export default function WindowControls() {
  return (
    <div>
      <HeaderButton>
        <BsDashLg />
      </HeaderButton>
      <HeaderButton>
        <BsSquare />
      </HeaderButton>
      <HeaderButton>
        <BsXLg />
      </HeaderButton>
    </div>
  );
}
