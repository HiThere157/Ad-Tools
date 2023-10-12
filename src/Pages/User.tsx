import { useTables, useDataSets, useTabs, useTabState } from "../Hooks/utils";
import { expectMultipleResults, softResetTables, getPSFilterString } from "../Helper/utils";
import { defaultAdQuery, defaultTableConfig } from "../Config/default";
import { invokePSCommand } from "../Helper/api";
import { firsObjectToPSDataSet } from "../Helper/postProcessors";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs, setActiveTabTitle } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`${page}_query`, activeTab, defaultAdQuery);
  const shouldPreSelect = expectMultipleResults(query);

  const [tableConfigs, setTableConfigs] = useTables(activeTab, page);
  const [dataSets, setDataSets] = useDataSets(activeTab, page);

  const runPreQuery = async () => {
    setDataSets({ search: null });

    const fields = ["Name", "Enabled", "SamAccountName", "UserPrincipalName"];
    invokePSCommand({
      command: `Get-AdUser <
        -Filter "${getPSFilterString(query.filter)}"
        -Server ${query.servers[0]}
        -Properties ${fields.join(",")}`,
      fields,
    }).then((response) => {
      setDataSets({ search: response });
    });

    setActiveTabTitle("Search Results");
    setTableConfigs(softResetTables(tableConfigs));
  };

  const runQuery = async (query: AdQuery, resetSearch?: boolean) => {
    setDataSets({ attributes: null, groups: null }, !resetSearch);

    invokePSCommand({
      command: `Get-AdUser -Identity ${query.filter.Name} -Server ${query.servers[0]} -Properties *`,
    }).then((response) => {
      setDataSets({ attributes: firsObjectToPSDataSet(response) }, true);
    });

    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership -Identity ${query.filter.Name}`,
      fields: ["Name", "GroupCategory", "DistinguishedName"],
    }).then((response) => {
      setDataSets({ groups: response }, true);
    });

    setActiveTabTitle(query.filter.Name || "User");
    setTableConfigs(softResetTables(tableConfigs, ["attributes", "groups"]));
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="px-4 py-2">
        <AdQuery
          query={query}
          setQuery={setQuery}
          onSubmit={() => (shouldPreSelect ? runPreQuery() : runQuery(query, true))}
        />

        {dataSets.search !== undefined && (
          <Table
            title="Search Results"
            dataSet={dataSets.search}
            config={tableConfigs.search ?? defaultTableConfig}
            setConfig={(config) => setTableConfigs({ ...tableConfigs, search: config })}
            onRedirect={(row: PSResult & { Name?: string }) => {
              runQuery({ ...query, filter: { Name: row.Name ?? "" } });
            }}
          />
        )}

        <Table
          title="User Attributes"
          dataSet={dataSets.attributes}
          config={tableConfigs.attributes ?? defaultTableConfig}
          setConfig={(config) => setTableConfigs({ ...tableConfigs, attributes: config })}
        />

        <Table
          title="User Groups"
          dataSet={dataSets.groups}
          config={tableConfigs.groups ?? defaultTableConfig}
          setConfig={(config) => setTableConfigs({ ...tableConfigs, groups: config })}
        />
      </div>
    </div>
  );
}
