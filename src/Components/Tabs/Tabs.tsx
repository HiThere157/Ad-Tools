import Tab from "./Tab";

import { BsPlus } from "react-icons/bs";

type TabsProps = {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
};
export default function Tabs({ activeTab, setActiveTab, tabs, setTabs }: TabsProps) {
  const addTab = () => {
    const id = new Date().getTime();
    setTabs([...tabs, { id, title: "Untitled" }]);
    setActiveTab(id);
  };

  const removeTab = (id: number) => {
    if (tabs.length === 1) {
      return;
    }

    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);

    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="flex items-center gap-0.5 bg-light px-2 pt-1">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          tab={tab}
          isActive={tab.id === activeTab}
          onChange={() => setActiveTab(tab.id)}
          onRemove={() => removeTab(tab.id)}
        />
      ))}

      <button
        className="mx-1 rounded-full text-xl hover:bg-secondaryAccent active:bg-secondaryActive"
        onClick={addTab}
      >
        <BsPlus />
      </button>
    </div>
  );
}