import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult, softResetTableConfig } from "../Redux/data";
import { defaultAdQuery } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultAdQuery;

  const updatePageTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabResult = (name: string, result: Loadable<PSDataSet>) =>
    dispatch(setResult({ page, tabId, name, result }));
  const softResetTabTableConfig = (name: string) =>
    dispatch(softResetTableConfig({ page, tabId, name }));

  return {
    tabId,
    query: tabQuery,
    updateTab: updatePageTab,
    setResult: setTabResult,
    softResetTableConfig: softResetTabTableConfig,
  };
}
