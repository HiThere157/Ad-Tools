import { useSessionStorage } from "./useStorage";

// This is a hook that will return the state for a specific tab on a page, and a helpful function to set it
export function useTabState<T>(key: string, tabId: number) {
  const [state, setState] = useSessionStorage<PartialRecord<number, T>>(key, {});

  const thisState = state[tabId];
  const setThisState = (newState: T, incremental?: boolean) => {
    setState((oldState) => {
      const newStateForTab = incremental ? { ...oldState[tabId], ...newState } : newState;
      return { ...oldState, [tabId]: newStateForTab };
    });
  };

  return [thisState, setThisState] as const;
}

// This is a hook is a helpful function to get all necessary state for a page with tabs
export function useTabs(page: string) {
  const [activeTab, setActiveTab] = useSessionStorage<number>(`${page}_activeTab`, 0);
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`${page}_tabs`, [{ id: 0, title: "Untitled" }]);

  const setActiveTabTitle = (title: string) => {
    setTabs((oldTabs) => {
      return oldTabs.map((tab) => {
        if (tab.id === activeTab) {
          return { ...tab, title };
        }
        return tab;
      });
    });
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
    setActiveTabTitle,
  };
}

// reset all table "selected" and set "pagination.page" to 0
export function softResetTables(tableConfigs?: PartialRecord<string, TableConfig>) {
  const newConfigs = { ...tableConfigs };

  Object.keys(newConfigs).forEach((key) => {
    const config = newConfigs[key];

    if (config) {
      config.selected = [];
      config.pagination.page = 0;
    }
  });

  return newConfigs;
}
