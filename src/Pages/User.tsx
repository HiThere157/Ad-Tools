import { useTabs, useTabState } from "../Hooks/utils";
import { adQuery, tableConfig } from "../Config/default";

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
      timestamp: Date.now(),
      executionTime: 1337,
      data: {
        result: [
          {
            __id__: 1,
            username: "test",
            attrib1: "testattrib1",
            numeric: 1,
            numeric2: 2,
          },
          {
            __id__: 2,
            username: "test2",
            attrib1: "testattrib21",
            numeric: 2,
            numeric2: 1,
          },
        ],
      },
      columns: ["username", "attrib1", "numeric", "numeric2"],
    };

    setDataSets([searchResult]);
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="mx-2">
        <AdQuery query={query ?? adQuery} setQuery={setQuery} onSubmit={runQuery} />

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
