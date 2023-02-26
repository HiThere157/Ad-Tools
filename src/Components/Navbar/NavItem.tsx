import { NavLink } from "react-router-dom";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
};
export default function NavItem({ to, icon, text, isOpen }: NavItemProps) {
  return (
    <NavLink
      to={to}
      draggable="false"
      className={({ isActive }) =>
        "control mb-1 " +
        (isActive
          ? "bg-elAccentBg"
          : "hover:bg-elFlatAccentBg focus:bg-elFlatAccentBg active:bg-elFlatActiveBg")
      }
    >
      <div className="flex flex-row items-center p-1">
        <div className="text-xl">{icon}</div>
        {isOpen && <span className="ml-2 whitespace-nowrap">{text}</span>}
      </div>
    </NavLink>
  );
}
