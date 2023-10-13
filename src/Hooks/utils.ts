import { defaultTableConfig } from "../Config/default";
import { useLocalStorage, useSessionStorage } from "./useStorage";

// This is a helpful hook to get all necessary state for a page with tabs
export function useTabs(page: string) {
  const [activeTab, setActiveTab] = useSessionStorage<number>(`${page}_activeTab`, 0);
  const [tabs, setTabs] = useSessionStorage<Tab[]>(`${page}_tabs`, [{ id: 0, title: "Untitled" }]);

  const updateTab = (newTab: Partial<Omit<Tab, "id">>) => {
    setTabs((oldTabs) => {
      return oldTabs.map((tab) => {
        if (tab.id === activeTab) {
          return { ...tab, ...newTab };
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
    updateTab,
  };
}

// This is a hook that will return the state for a specific tab on a page, and a helpful function to set it
export function useTabState<T>(key: string, tabId: number, initialState: T) {
  const [state, setState] = useSessionStorage<PartialRecord<number, T>>(key, {});

  const thisState = state[tabId] ?? initialState;
  const setThisState = (newState: T, incremental?: boolean) => {
    setState((oldState) => {
      // If incremental is true, we want to merge the new state with the old state
      if (incremental) {
        return { ...oldState, [tabId]: { ...oldState[tabId], ...newState } };
      }

      // Otherwise, we want to replace the old state with the new state
      return { ...oldState, [tabId]: newState };
    });
  };

  return [thisState, setThisState] as const;
}

// This is a helpful hook to to handle persistent and volatile table state
export function useTables(tabId: number, page: string) {
  const [tableConfigs, setTableConfigs] = useTabState<PartialRecord<string, VolatileTableConfig>>(
    `${page}_tableConfigs`,
    tabId,
    {},
  );
  const [persistentTableConfigs, setPersistentTableConfigs] = useLocalStorage<
    PartialRecord<string, PersistentTableConfig>
  >(`${page}_tableConfigs`, {});

  const tableNames = Object.keys({ ...tableConfigs, ...persistentTableConfigs });

  const thisConfigs = tableNames.reduce((acc, key) => {
    // Merge the volatile and persistent configs for each table
    return {
      ...acc,
      [key]: {
        volatile: tableConfigs[key] ?? defaultTableConfig.volatile,
        persistent: persistentTableConfigs[key] ?? defaultTableConfig.persistent,
      },
    };
  }, {}) as PartialRecord<string, TableConfig>;
  const setThisConfigs = (newConfigs: PartialRecord<string, TableConfig>) => {
    // Split the volatile and persistent configs for each table
    setTableConfigs(
      Object.keys(newConfigs).reduce((acc, key) => {
        return { ...acc, [key]: newConfigs[key]?.volatile };
      }, {}),
    );
    setPersistentTableConfigs(
      Object.keys(newConfigs).reduce((acc, key) => {
        return { ...acc, [key]: newConfigs[key]?.persistent };
      }, {}),
    );
  };

  return [thisConfigs, setThisConfigs] as const;
}

export function useDataSets(tabId: number, page: string) {
  return useTabState<PartialRecord<string, Loadable<PSDataSet>>>(`${page}_dataSets`, tabId, {});
}
