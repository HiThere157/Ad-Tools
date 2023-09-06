import { useQuery, useTabs } from "../Hooks/utils";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";

const page = "user";
export default function User() {
  const { activeTab, setActiveTab, tabs, setTabs, setTabTitle } = useTabs(page);
  const { query, setQuery } = useQuery<AdQuery>(page, activeTab);

  const runQuery = () => {
    setTabTitle(query?.filter?.name?.trim() || "Untitled");

  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <AdQuery query={query ?? {}} setQuery={setQuery} onSubmit={runQuery} />
    </div>
  );
}
