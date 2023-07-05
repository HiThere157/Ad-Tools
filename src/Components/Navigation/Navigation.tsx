import React from "react";

import { navigationLinks } from "../../Config/navigation";

import NavigationLink from "./NavigationLink";

export default function Navigation() {
  return (
    <nav
      style={{ gridArea: "nav" }}
      className="flex select-none flex-col overflow-auto bg-light p-1"
    >
      {navigationLinks.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex !== 0 && <hr className="my-1.5 border-border" />}

          {group.map(({ href, text, icon, isHidden }, linkIndex) =>
            isHidden ? null : (
              <NavigationLink
                key={linkIndex}
                href={href}
                text={text}
                icon={icon}
                isExpanded={true}
              />
            ),
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
