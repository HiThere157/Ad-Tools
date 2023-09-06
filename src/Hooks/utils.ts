import { useSessionStorage } from "./useStorage";

// This is a hook that will return the query and a function to set the query for a specific page and tab
export function useQuery<T>(page: string, tabId: number) {
  // get all queries from this page
  const [query, setQuery] = useSessionStorage<Record<number, T>>(`query_${page}`, {});

  // get the query for this tab and
  // create a function to set the query for this tab
  const thisQuery = query[tabId] as T | undefined;
  const setThisQuery = (newQuery: T) => {
    setQuery({
      ...query,
      [tabId]: newQuery,
    });
  };

  return {
    query: thisQuery,
    setQuery: setThisQuery,
  };
}

// This is a hook that will return the current tab, all tabs, and functions to set them for a specific page
export function useTabs(page: string) {
  const [activeTab, setActiveTab] = useSessionStorage<number>(`activeTab_${page}`, 0);
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`tabs_${page}`, [{ id: 0, title: "Untitled" }]);

  const setTabTitle = (title: string) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === activeTab) {
          return { ...tab, title };
        }
        return tab;
      }),
    );
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
    setTabTitle,
  };
}
