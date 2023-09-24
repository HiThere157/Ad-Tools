import { useSessionStorage } from "./useStorage";

// This is a hook that will return the state for a specific tab on a page, and a helpful function to set it
export function useTabState<T>(key: string, tabId: number) {
  const [state, setState] = useSessionStorage<PartialRecord<number, T>>(key, {});

  const thisState = state[tabId];
  const setThisState = (newState: T) => {
    setState({
      ...state,
      [tabId]: newState,
    });
  };

  return [thisState, setThisState] as const;
}

// This is a hook is a helpful function to get all necessary state for a page with tabs
export function useTabs(page: string) {
  const [activeTab, setActiveTab] = useSessionStorage<number>(`activeTab_${page}`, 0);
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`tabs_${page}`, [{ id: 0, title: "Untitled" }]);

  return {
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
  };
}
