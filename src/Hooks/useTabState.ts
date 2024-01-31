import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabsSlice";
import { setDataSet, setQuery, setTableConfig } from "../Redux/dataSlice";
import { setTablePreferences } from "../Redux/preferencesSlice";
import { defaultQuery, defaultTableConfig, defaultTablePreferences } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query, dataSets, tableConfigs } = useSelector((state: RootState) => state.data);
  const { tablePreferences } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultQuery;
  const tabDataSets = dataSets[page]?.[tabId] ?? {};
  const tabTableConfigs = tableConfigs[page]?.[tabId] ?? {};
  const pageTablePreferences = tablePreferences[page] ?? {};

  const tabIsLocked = Object.values(tabDataSets).some((dataSet) => dataSet === null);

  const pageTableColumns: PartialRecord<string, string[]> = Object.fromEntries(
    Object.entries(pageTablePreferences).map(([name, tablePreference]) => {
      const columns = tablePreference?.columns
        .map(({ name }) => name)
        .filter((name) => !name.startsWith("_"));
      return [name, columns ?? []];
    }),
  );
  const tabTableState: PartialRecord<string, TableState> = Object.fromEntries(
    [...Object.keys(tabTableConfigs), ...Object.keys(pageTablePreferences)].map((name) => {
      const state: TableState = {
        config: tabTableConfigs[name] ?? defaultTableConfig,
        preferences: pageTablePreferences[name] ?? defaultTablePreferences,
      };
      return [name, state];
    }),
  );

  const updateTabTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabQuery = (query: Query) => dispatch(setQuery({ page, tabId, query }));
  const setTabDataSet = (name: string | string[], dataSet: DataSet | Promise<DataSet>) => {
    const names = Array.isArray(name) ? name : [name];
    names.forEach(async (name) => {
      dispatch(setDataSet({ page, tabId, name, dataSet: await dataSet }));
    });
  };
  const setTabTableState = (name: string, tableState: TableState) => {
    const { config, preferences } = tableState;
    dispatch(setTableConfig({ page, tabId, name, config }));
    dispatch(setTablePreferences({ page, name, preferences }));
  };

  return {
    query: tabQuery,
    isLocked: tabIsLocked,
    dataSets: tabDataSets,
    tableStates: tabTableState,
    tableColumns: pageTableColumns,
    updateTab: updateTabTab,
    setQuery: setTabQuery,
    setDataSet: setTabDataSet,
    setTableState: setTabTableState,
  };
}
