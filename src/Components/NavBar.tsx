import { NavLink } from "react-router-dom";

import {
  BsSearch,
  BsFillPersonLinesFill,
  BsPeopleFill,
  BsDisplay,
  BsServer,
  BsClockHistory,
  BsGearFill,
} from "react-icons/bs";

type NavBarProps = {
  isOpen: boolean
}
export default function NavBar({ isOpen }: NavBarProps) {
  return (
    <nav className="flex flex-col p-2 dark:bg-secondaryBg">
      <NavItem
        to="/search"
        icon={<BsSearch />}
        text="Search"
        isOpen={isOpen}
      />
      <NavItem
        to="/user"
        icon={<BsFillPersonLinesFill />}
        text="User"
        isOpen={isOpen}
      />
      <NavItem
        to="/group"
        icon={<BsPeopleFill />}
        text="Group"
        isOpen={isOpen}
      />
      <NavItem
        to="/computer"
        icon={<BsDisplay />}
        text="Computer"
        isOpen={isOpen}
      />
      <hr className="my-2 dark:border-primaryBorder" />
      <NavItem
        to="/aadUser"
        icon={<BsFillPersonLinesFill />}
        text="Azure User"
        isOpen={isOpen}
      />
      <NavItem
        to="/aadGroup"
        icon={<BsPeopleFill />}
        text="Azure Group"
        isOpen={isOpen}
      />
      <hr className="my-2 dark:border-primaryBorder" />
      <NavItem
        to="/dns"
        icon={<BsServer />}
        text="DNS"
        isOpen={isOpen}
      />
      <hr className="my-2 dark:border-primaryBorder" />
      <NavItem
        to="/history"
        icon={<BsClockHistory />}
        text="History"
        isOpen={isOpen}
      />
      <NavItem
        to="/settings"
        icon={<BsGearFill />}
        text="Settings"
        isOpen={isOpen}
      />
    </nav>
  );
}

type NavItemProps = {
  to: string,
  icon: React.ReactNode,
  text: string,
  isOpen: boolean
}
function NavItem({ to, icon, text, isOpen }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "control mt-1 border-0 " +
        (isActive
          ? "dark:bg-primaryControlAccent"
          : "dark:hover:bg-secondaryControlAccent dark:focus:bg-secondaryControlAccent dark:active:bg-secondaryControlActive")
      }
    >
      <div className="flex flex-row items-center p-1">
        <div className="text-xl">{icon}</div>
        {isOpen ? <span className="ml-2 whitespace-nowrap">{text}</span> : ""}
      </div>
    </NavLink>
  );
}
