import { useTabs, useTabState } from "../Hooks/utils";
import { tableConfig } from "../Config/default";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`query_${page}`, activeTab);
  const [dataSets, setDataSets] = useTabState<DataSet<Loadable<PSResult>>[]>(
    `dataSets_${page}`,
    activeTab,
  );
  const [tableConfigs, setTableConfigs] = useTabState<Record<string, TableConfig | undefined>>(
    `tableConfigs_${page}`,
    activeTab,
  );

  const runQuery = () => {
    const searchResult: DataSet<Loadable<PSResult>> = {
      key: `${page}_search`,
      title: "Search",
      timestamp: Date.now().toString(),
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

    setDataSets([searchResult]);
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <AdQuery query={query} setQuery={setQuery} onSubmit={runQuery} />

      <div className="mx-2">
        {dataSets?.map((dataSet) => (
          <Table
            key={dataSet.key}
            dataSet={dataSet}
            config={tableConfigs?.[dataSet.key] ?? tableConfig}
            setConfig={(config) => {
              setTableConfigs({
                ...tableConfigs,
                [dataSet.key]: config,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
