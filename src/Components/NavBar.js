import { NavLink } from "react-router-dom";

import {
  BsFillPersonLinesFill,
  BsPeopleFill,
  BsDisplay,
  BsClockHistory,
  BsGearFill,
} from "react-icons/bs";

export default function NavBar({ isOpen }) {
  return (
    <nav className="flex flex-col p-3 dark:bg-secondaryBg">
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
      <hr className="my-4" />
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
      <hr className="my-4" />
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

function NavItem({ to, icon, text, isOpen }) {
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
        {isOpen ? <span className="ml-3 whitespace-nowrap">{text}</span> : ""}
      </div>
    </NavLink>
  );
}
