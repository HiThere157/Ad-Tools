import { useTabs, useTabState } from "../Hooks/utils";
import { adQuery, tableConfig } from "../Config/default";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`query_${page}`, activeTab);
  const [dataSets, setDataSets] = useTabState<PartialRecord<string, PSDataSet>>(
    `dataSets_${page}`,
    activeTab,
  );
  const [tableConfigs, setTableConfigs] = useTabState<PartialRecord<string, TableConfig>>(
    `tableConfigs_${page}`,
    activeTab,
  );

  const runQuery = () => {
    const searchResult: PSDataSet = {
      timestamp: Date.now(),
      executionTime: 1337,
      data: {
        result: [...Array(100).keys()].map((i) => ({
          __id__: i,
          username: `test${i}`,
          attrib1: `testattrib${i}`,
          numeric: Math.random() * 1000,
          numeric2: Math.random() * 1000,
        })),
      },
      columns: ["username", "attrib1", "numeric", "numeric2"],
    };

    setDataSets({
      ...dataSets,
      table1: searchResult,
    });
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="mx-2 mb-20">
        <AdQuery query={query ?? adQuery} setQuery={setQuery} onSubmit={runQuery} />

        {/* <Table
          dataSet={dataSets?.["table1"]}
          config={tableConfigs?.["table1"] ?? tableConfig}
          setConfig={(config) => {
            setTableConfigs({
              ...tableConfigs,
              table1: config,
            });
          }}
        /> */}
      </div>
    </div>
  );
}
