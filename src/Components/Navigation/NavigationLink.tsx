import { NavLink } from "react-router-dom";

type NavigationLinkProps = {
  text: string;
  href: string;
  icon: React.ReactNode;
  isExpanded: boolean;
};
export default function NavigationLink({ text, href, icon, isExpanded }: NavigationLinkProps) {
  return (
    <NavLink
      draggable="false"
      to={href}
      className={({ isActive }) =>
        `mx-1 my-0.5 flex items-center gap-1 rounded py-0.5 pl-1 pr-2 ${
          isActive
            ? "bg-primaryAccent hover:bg-primaryActive"
            : "bg-light hover:bg-secondaryAccent active:bg-secondaryActive"
        }`
      }
    >
      <div className="px-1 text-xl">{icon}</div>
      {isExpanded && <span>{text}</span>}
    </NavLink>
  );
}
