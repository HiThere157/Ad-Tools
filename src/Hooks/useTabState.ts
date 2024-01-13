import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabsSlice";
import { setDataSet } from "../Redux/dataSlice";
import { defaultQuery } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const { tablePreferences } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultQuery;
  const pageColumns = Object.fromEntries(
    Object.entries(tablePreferences[page] ?? {}).map(([name, tablePreference]) => {
      const columns = tablePreference?.columns
        .map(({ name }) => name)
        .filter((name) => !name.startsWith("_"));
      return [name, columns ?? []];
    }),
  );

  const updateTabTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabDataSet = (name: string | string[], dataSet: DataSet | Promise<DataSet>) => {
    const names = Array.isArray(name) ? name : [name];

    names.forEach(async (name) => {
      dispatch(setDataSet({ page, tabId, name, dataSet: await dataSet }));
    });
  };

  return {
    tabId,
    query: tabQuery,
    columns: pageColumns,
    updateTab: updateTabTab,
    setDataSet: setTabDataSet,
  };
}
