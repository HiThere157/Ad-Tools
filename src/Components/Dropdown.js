import { useState, useRef, useEffect } from "react";

import Button from "./Button";

import { BsCaretDownFill } from "react-icons/bs";

export default function Dropdown({
  items,
  value = null,
  disabled = false,
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value ?? items[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const changeSelectedItem = (item) => {
    setSelectedItem(item);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="w-max">
      <Button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <div className="flex items-center">
          {selectedItem}
          <BsCaretDownFill
            className={"ml-2 text-base " + (isOpen ? "rotate-180" : "")}
          />
        </div>
      </Button>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <DropdownBody items={items} onSelection={changeSelectedItem} />
      </div>
    </div>
  );
}

function DropdownBody({ items, onSelection }) {
  return (
    <div className="absolute flex flex-col min-w-full rounded-md overflow-hidden mt-1">
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            classOverride="rounded-none"
            onClick={() => {
              onSelection(item);
            }}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
}
