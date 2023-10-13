import React, { useState } from "react";

import { useLocalStorage } from "../../Hooks/useStorage";
import { navigationLinks } from "../../Config/navigation";

import NavigationLink from "./NavigationLink";

import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Navigation() {
  const [counter, setCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>(
    "preferences_isNavigationExpanded",
    true,
  );

  return (
    <nav style={{ gridArea: "nav" }} className="flex select-none flex-col overflow-auto bg-light">
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          setCounter(counter + 1);
        }}
        className="mb-1 flex h-8 w-full items-center justify-center bg-primary hover:bg-primaryAccent active:bg-primaryActive"
      >
        {isExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
      </button>

      {navigationLinks.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex !== 0 && <hr className="mx-1 my-1.5 border-border" />}

          {group.map(
            (link, linkIndex) =>
              (!link.isHidden || (link.isEasterEgg && counter >= 25)) && (
                <NavigationLink key={linkIndex} link={link} isExpanded={isExpanded} />
              ),
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
