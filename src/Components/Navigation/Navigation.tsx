import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { toggleNavBar } from "../../Redux/preferences";
import { navigationLinks } from "../../Config/navigation";

import NavigationLink from "./NavigationLink";

import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Navigation() {
  const [counter, setCounter] = useState(0);
  const { isNavBarExpanded } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  return (
    <nav style={{ gridArea: "nav" }} className="flex select-none flex-col overflow-auto bg-light">
      <button
        onClick={() => {
          dispatch(toggleNavBar())
          setCounter(counter + 1);
        }}
        className="mb-1 flex h-8 w-full items-center justify-center bg-primary hover:bg-primaryAccent active:bg-primaryActive"
      >
        {isNavBarExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
      </button>

      {navigationLinks.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex !== 0 && <hr className="mx-1 my-1.5 border-border" />}

          {group.map(
            (link, linkIndex) =>
              (!link.isHidden || (link.isEasterEgg && counter >= 25)) && (
                <NavigationLink key={linkIndex} link={link} isExpanded={isNavBarExpanded} />
              ),
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
