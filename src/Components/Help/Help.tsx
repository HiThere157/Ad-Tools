import { useState } from "react";

import { helpNavigationLinks } from "../../Config/navigation";

import Popup from "../Popup/Popup";
import HeaderButton from "../Header/HeaderButton";

import { BsLifePreserver } from "react-icons/bs";

export default function Help() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("#help/query");

  return (
    <div className="winbar-no-drag">
      <HeaderButton onClick={() => setIsOpen(!isOpen)}>
        <BsLifePreserver />
      </HeaderButton>

      <Popup isOpen={isOpen} title="Help" onCancel={() => setIsOpen(false)}>
        <div className="flex">
          <div className="flex flex-shrink-0 flex-col gap-1">
            {helpNavigationLinks.map(({ href, icon, text }) => (
              <button
                key={href}
                className={`flex items-center gap-2 rounded px-2 py-0.5 outline-none outline-offset-0 ${
                  activeTab === href
                    ? "bg-primaryAccent hover:bg-primaryActive"
                    : "hover:bg-secondaryAccent focus-visible:outline-borderActive active:bg-secondaryActive"
                }`}
                onClick={() => setActiveTab(href)}
              >
                <div className="text-xl">{icon}</div>
                <span>{text}</span>
              </button>
            ))}
          </div>

          <div className="mx-1.5 w-1 border-r border-border" />

          {helpNavigationLinks.find(({ href }) => href === activeTab)?.page}
        </div>
      </Popup>
    </div>
  );
}
