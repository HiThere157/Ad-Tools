import { NavLink } from "react-router-dom";

type NavigationLinkProps = {
  link: NavigationLink;
  isExpanded: boolean;
};
export default function NavigationLink({ link, isExpanded }: NavigationLinkProps) {
  const { href, text, icon } = link;

  return (
    <NavLink
      draggable="false"
      to={href}
      className={({ isActive }) =>
        `mx-2 my-0.5 flex items-center gap-2 rounded px-2 py-0.5 outline-none outline-offset-0 ${
          isActive
            ? "bg-primaryAccent hover:bg-primaryActive"
            : "bg-light hover:bg-secondaryAccent focus-visible:outline-borderActive active:bg-secondaryActive"
        }`
      }
    >
      <div className="text-xl">{icon}</div>
      {isExpanded && <span>{text}</span>}
    </NavLink>
  );
}
