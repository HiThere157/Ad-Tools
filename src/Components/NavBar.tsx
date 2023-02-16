import { NavLink } from "react-router-dom";
import { useLocalStorage } from "../Hooks/useStorage";

import Button from "./Button";

import {
  BsSearch,
  BsFillPersonLinesFill,
  BsPeopleFill,
  BsDisplay,
  BsCpu,
  BsPrinterFill,
  BsLaptop,
  BsServer,
  BsClockHistory,
  BsGearFill,
} from "react-icons/bs";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function NavBar() {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>("main_isNavOpen", true);

  return (
    <nav
      style={{ gridArea: "navbar" }}
      className="select-none flex flex-col overflow-auto dark:bg-lightBg"
    >
      <Button
        classList="flex justify-center py-0.5 rounded-none text-xl"
        theme="colorOnHover"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
      </Button>
      <div className="flex flex-col p-2">
        <NavItem to="/search" icon={<BsSearch />} text="Search" isOpen={isOpen} />
        <NavItem to="/user" icon={<BsFillPersonLinesFill />} text="User" isOpen={isOpen} />
        <NavItem to="/group" icon={<BsPeopleFill />} text="Group" isOpen={isOpen} />
        <NavItem to="/computer" icon={<BsDisplay />} text="Computer" isOpen={isOpen} />
        <NavItem to="/wmi" icon={<BsCpu />} text="WMI" isOpen={isOpen} />
        <NavItem to="/printer" icon={<BsPrinterFill />} text="Printers" isOpen={isOpen} />
        <hr className="my-2 dark:border-elFlatBorder" />
        <NavItem to="/azureSearch" icon={<BsSearch />} text="Azure Search" isOpen={isOpen} />
        <NavItem
          to="/azureUser"
          icon={<BsFillPersonLinesFill />}
          text="Azure User"
          isOpen={isOpen}
        />
        <NavItem to="/azureGroup" icon={<BsPeopleFill />} text="Azure Group" isOpen={isOpen} />
        <NavItem to="/azureDevice" icon={<BsLaptop />} text="Azure Device" isOpen={isOpen} />
        <hr className="my-2 dark:border-elFlatBorder" />
        <NavItem to="/dns" icon={<BsServer />} text="DNS" isOpen={isOpen} />
        <hr className="my-2 dark:border-elFlatBorder" />
        <NavItem to="/history" icon={<BsClockHistory />} text="History" isOpen={isOpen} />
        <NavItem to="/settings" icon={<BsGearFill />} text="Settings" isOpen={isOpen} />
      </div>
    </nav>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
};
function NavItem({ to, icon, text, isOpen }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "control mb-1 " +
        (isActive
          ? "dark:bg-elAccentBg"
          : "dark:hover:bg-elFlatAccentBg dark:focus:bg-elFlatAccentBg dark:active:bg-elFlatActiveBg")
      }
    >
      <div className="flex flex-row items-center p-1">
        <div className="text-xl">{icon}</div>
        {isOpen && <span className="ml-2 whitespace-nowrap">{text}</span>}
      </div>
    </NavLink>
  );
}
