import { useTabs, useTabState } from "../Hooks/utils";
import { adQuery, tableConfig } from "../Config/default";
import { invokePSCommand } from "../Helper/api";
import { firsObjectToPSDataSet } from "../Helper/postProcessors";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`${page}_query`, activeTab);
  const [dataSets, setDataSets] = useTabState<PartialRecord<string, Loadable<PSDataSet>>>(
    `${page}_dataSets`,
    activeTab,
  );
  const [tableConfigs, setTableConfigs] = useTabState<PartialRecord<string, TableConfig>>(
    `${page}_tableConfigs`,
    activeTab,
  );

  const runQuery = () => {
    (async () => {
      // Reset data
      setDataSets({
        attributes: null,
        groups: null,
      });

      invokePSCommand({
        command: `Get-AdUser -Identity ${query?.filter?.name} -Properties *`,
      }).then((response) => {
        setDataSets({
          ...dataSets,
          attributes: firsObjectToPSDataSet(response),
        });
      });

      invokePSCommand({
        command: `Get-AdPrincipalGroupMembership -Identity ${query?.filter?.name}`,
        fields: ["Name", "GroupCategory", "DistinguishedName"],
      }).then((response) => {
        setDataSets({
          ...dataSets,
          groups: firsObjectToPSDataSet(response),
        });
      });

      // Reset pagination and selection
      const attribConfig = tableConfigs?.["attributes"] ?? tableConfig;
      const groupConfig = tableConfigs?.["groups"] ?? tableConfig;
      setTableConfigs({
        ...tableConfigs,
        attributes: {
          ...attribConfig,
          selected: [],
          pagination: {
            ...attribConfig.pagination,
            page: 0,
          },
        },
        groups: {
          ...groupConfig,
          selected: [],
          pagination: {
            ...groupConfig.pagination,
            page: 0,
          },
        },
      });
    })();
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="mx-2">
        <AdQuery query={query ?? adQuery} setQuery={setQuery} onSubmit={runQuery} />

        <Table
          title="User Attributes"
          dataSet={dataSets?.["attributes"]}
          config={tableConfigs?.["attributes"] ?? tableConfig}
          setConfig={(config) => {
            setTableConfigs({
              ...tableConfigs,
              attributes: config,
            });
          }}
        />

        <Table
          title="User Groups"
          dataSet={dataSets?.["groups"]}
          config={tableConfigs?.["groups"] ?? tableConfig}
          setConfig={(config) => {
            setTableConfigs({
              ...tableConfigs,
              groups: config,
            });
          }}
        />
      </div>
    </div>
  );
}
