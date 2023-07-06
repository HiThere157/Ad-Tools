import { NavLink } from "react-router-dom";

type NavigationLinkProps = {
  text: string;
  href: string;
  icon: React.ReactNode;
  isExpanded: boolean;
};
export default function NavigationLink({
  text,
  href,
  icon,
  isExpanded,
}: NavigationLinkProps) {
  return (
    <NavLink
      draggable="false"
      to={href}
      className={({ isActive }) =>
        `mx-2 my-0.5 flex items-center gap-2 rounded px-2 py-0.5 ${
          isActive
            ? "bg-primaryAccent hover:bg-primaryActive"
            : "bg-light hover:bg-secondaryAccent active:bg-secondaryActive"
        }`
      }
    >
      <div className="text-xl">{icon}</div>
      {isExpanded && <span>{text}</span>}
    </NavLink>
  );
}
