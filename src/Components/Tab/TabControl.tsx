import { useEffect, useRef, useState } from "react";

import Button from "../Button";

type TabControlProps = {
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (newIndex: number) => any;
};
export default function TabControl({ children, defaultIndex, onChange }: TabControlProps) {
  const behavior = useRef<ScrollBehavior>("auto");
  const bodyRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex ?? 0);
  const [tabs, setTabs] = useState<Element[]>([]);

  useEffect(() => {
    setTabs([...(bodyRef.current?.children ?? [])]);
  }, [children, bodyRef]);

  useEffect(() => {
    tabs[selectedIndex]?.scrollIntoView({ behavior: behavior.current });

    // prevent smooth scroll on first open
    setTimeout(() => (behavior.current = "smooth"), 0);

    onChange?.(selectedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, tabs]);

  return (
    <div>
      <div className="flex justify-center items-center">
        {tabs.map((tab, index) => {
          return (
            <div key={index} className="text-lg my-2">
              <Button
                className="border-0 px-4"
                theme="invisible"
                onClick={() => {
                  setSelectedIndex(index);
                }}
              >
                {tab.getAttribute("data-tab-title")}
              </Button>
              <div
                className={
                  (index === selectedIndex ? "bg-elAccentBg " : "bg-elFlatBorder ") + "h-1"
                }
              ></div>
            </div>
          );
        })}
      </div>
      <div ref={bodyRef} className="flex overflow-x-hidden my-2">
        {children}
      </div>
    </div>
  );
}
