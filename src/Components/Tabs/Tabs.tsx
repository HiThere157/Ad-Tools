import { useSessionStorage } from "../../Hooks/useStorage";

import Tab from "./Tab";

import { BsPlus } from "react-icons/bs";

type TabsProps = {
  currentPath: string;
  currentTab: number;
  setCurrentTab: (tab: number) => void;
};
export default function Tabs({ currentPath, currentTab, setCurrentTab }: TabsProps) {
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`tabs_${currentPath}`, [
    { id: 0, title: "Default" },
  ]);

  const addTab = () => {
    const id = new Date().getTime();
    setTabs([...tabs, { id, title: "New" }]);
    setCurrentTab(id);
  };

  const removeTab = (id: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);

    if (currentTab === id) {
      setCurrentTab(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="flex items-center gap-0.5 bg-light px-2 pt-1">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          tab={tab}
          isActive={tab.id === currentTab}
          onChange={() => setCurrentTab(tab.id)}
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
