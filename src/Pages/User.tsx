import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../Redux/store";
import { getPageState, getTabState } from "../Helper/utils";
import { setQuery } from "../Redux/queries";
import { defaultAdQuery } from "../Config/default";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";

export default function User() {
  const page = "user";
  const { activeTab = 0 } = useSelector(
    createSelector(
      (state: RootState) => state.tabs,
      (tabs) => getPageState(tabs, page),
    ),
  );
  const { query = defaultAdQuery } = useSelector(
    createSelector(
      (state: RootState) => state.queries,
      (queries) => getTabState(queries, page, activeTab),
    ),
  );
  const dispatch = useDispatch();

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery
          query={query}
          setQuery={(query) => dispatch(setQuery({ page, tabId: activeTab, query }))}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}
