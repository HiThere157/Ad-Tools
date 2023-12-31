import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult } from "../Redux/data";
import { defaultQuery } from "../Config/default";

export function useTabState(page: string) {
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultQuery;

  const updatePageTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabResult = (
    name: string | string[],
    result: ResultDataSet | Promise<ResultDataSet>,
  ) => {
    const names = Array.isArray(name) ? name : [name];

    names.forEach(async (name) => {
      dispatch(setResult({ page, tabId, name, result: await result }));
    });
  };

  return {
    tabId,
    query: tabQuery,
    updateTab: updatePageTab,
    setResult: setTabResult,
  };
}
