import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setDataSet } from "../Redux/data";
import { defaultQuery } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultQuery;

  const updatePageTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabDataSet = (name: string | string[], dataSet: DataSet | Promise<DataSet>) => {
    const names = Array.isArray(name) ? name : [name];

    names.forEach(async (name) => {
      dispatch(setDataSet({ page, tabId, name, dataSet: await dataSet }));
    });
  };

  return {
    tabId,
    query: tabQuery,
    updateTab: updatePageTab,
    setDataSet: setTabDataSet,
  };
}
