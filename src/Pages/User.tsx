import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setQuery } from "../Redux/queries";
import { defaultAdQuery } from "../Config/default";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";

export default function User() {
  const page = "user";
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.queries);
  const dispatch = useDispatch();

  const pageActiveTab = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[pageActiveTab] ?? defaultAdQuery;

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery
          query={tabQuery}
          setQuery={(query) => dispatch(setQuery({ page, tabId: pageActiveTab, query }))}
          onSubmit={() => { }}
        />
      </div>
    </div>
  );
}
