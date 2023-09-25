import { useTabs, useTabState } from "../Hooks/utils";
import { adQuery /*, tableConfig */ } from "../Config/default";
import { ElectronAPI } from "../../electron/preload";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
// import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`query_${page}`, activeTab);
  const [dataSets, setDataSets] = useTabState<PartialRecord<string, Loadable<PSDataSet>>>(
    `dataSets_${page}`,
    activeTab,
  );
  // const [tableConfigs, setTableConfigs] = useTabState<PartialRecord<string, TableConfig>>(
  //   `tableConfigs_${page}`,
  //   activeTab,
  // );

  const runQuery = () => {
    const electronWindow = window as Window & typeof globalThis & { electronAPI: ElectronAPI };

    (async () => {
      const request = {
        useGlobalSession: false,
        command: "Get-Process",
        fields: ["name"],
      };

      const result = await electronWindow.electronAPI.invokePSCommand(request);
      setDataSets({
        ...dataSets,
        [activeTab]: result,
      });
    })();
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="mx-2 mb-20">
        <AdQuery query={query ?? adQuery} setQuery={setQuery} onSubmit={runQuery} />

        {/* <Table
          title="Table 1"
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
