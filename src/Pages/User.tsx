import { useTabs, useTabState } from "../Hooks/utils";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`query_${page}`, activeTab);
  const [dataSets, setDataSets] = useTabState<DataSet<Loadable<PSResult>>[]>(`dataSets_${page}`, activeTab);

  const runQuery = () => {
    const searchResult: DataSet<Loadable<PSResult>> = {
      key: `${page}_search`,
      timestamp: Date.now().toString(),
      title: "Search",
      data: {
        result: [
          {
            __id__: 1,
            username: "test",
            attrib1: "testattrib1",
            attrib2: "testattrib2",
          },
          {
            __id__: 2,
            username: "test2",
            attrib1: "testattrib21",
            attrib2: "testattrib22",
          },
        ],
      },
      columns: ["username", "attrib1", "attrib2"],
    };

    setDataSets([...dataSets??[], searchResult]);
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <AdQuery query={query ?? {}} setQuery={setQuery} onSubmit={runQuery} />

      <div>
        {dataSets?.map((dataSet) => (
          <Table key={dataSet.key} dataSet={dataSet} />
        ))}
      </div>
    </div>
  );
}
