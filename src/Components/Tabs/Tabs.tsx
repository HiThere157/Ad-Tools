import { useLocalStorage, useSessionStorage } from "../../Hooks/useStorage";

import Tab from "./Tab";

type TabsProps = {
  currentPath: string;
  currentTab: string;
};
export default function Tabs({ currentPath, currentTab }: TabsProps) {
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`${currentPath}_tabs`, []);
  const [persistentTabs, setPersistentTabs] = useLocalStorage<Tab[]>(
    `${currentPath}_persistentTabs`,
    [],
  );

  return (
    <div className="flex items-center gap-2">
      {persistentTabs.map((tab, index) => (
        <Tab key={index} tab={tab} isPersistent={true} isActive={tab.id === currentTab} />
      ))}

      {tabs.map((tab, index) => (
        <Tab
          key={index}
          tab={tab}
          isPersistent={false}
          isActive={tab.id === currentTab}
        />
      ))}
    </div>
  );
}
