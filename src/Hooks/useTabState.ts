import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult } from "../Redux/data";
import { defaultAdQuery } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultAdQuery;

  const updatePageTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabResult = (name: string, result: Loadable<PSDataSet>, resetConfig?: boolean) =>
    dispatch(setResult({ page, tabId, name, result, resetConfig }));

  return {
    tabId,
    query: tabQuery,
    updateTab: updatePageTab,
    setResult: setTabResult,
  };
}
