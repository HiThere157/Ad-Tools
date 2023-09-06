import { useQuery, useTabs } from "../Hooks/utils";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);
  const { query, setQuery } = useQuery<AdQuery>(page, activeTab);

  const runQuery = () => {

  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <AdQuery query={query ?? {}} setQuery={setQuery} onSubmit={runQuery} />
    </div>
  );
}
