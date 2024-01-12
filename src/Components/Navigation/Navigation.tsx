import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { toggleNavBar } from "../../Redux/preferencesSlice";
import { navigationLinks } from "../../Config/navigation";

import NavigationLink from "./NavigationLink";

import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Navigation() {
  const [counter, setCounter] = useState(0);
  const { isNavBarExpanded } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  // Filter out hidden links and groups with no visible links
  const visibleLinks = navigationLinks
    .map((group) => group.filter((link) => !link.isHidden || (link.isEasterEgg && counter >= 25)))
    .filter((group) => group.length > 0);

  return (
    <nav style={{ gridArea: "nav" }} className="flex select-none flex-col overflow-auto bg-light">
      <button
        onClick={() => {
          dispatch(toggleNavBar());
          setCounter(counter + 1);
        }}
        className="mb-1 flex h-[1.875rem] flex-shrink-0 items-center justify-center bg-primary outline-none -outline-offset-2 hover:bg-primaryAccent focus-visible:rounded focus-visible:outline-borderActive active:bg-primaryActive"
      >
        {isNavBarExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
      </button>

      {visibleLinks.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex !== 0 && <div className="mx-1 my-1.5 border-t border-border" />}

          {group.map((link, linkIndex) => (
            <NavigationLink key={linkIndex} link={link} isExpanded={isNavBarExpanded} />
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
}
