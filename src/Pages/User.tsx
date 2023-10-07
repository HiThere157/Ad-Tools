import { expectMultipleResults, softResetTables, useTabs, useTabState } from "../Hooks/utils";
import { adQuery, tableConfig } from "../Config/default";
import { invokePSCommand } from "../Helper/api";
import { firsObjectToPSDataSet } from "../Helper/postProcessors";

import Tabs from "../Components/Tabs/Tabs";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { activeTab, setActiveTab, tabs, setTabs, setActiveTabTitle } = useTabs(page);

  const [query, setQuery] = useTabState<AdQuery>(`${page}_query`, activeTab, adQuery);
  const shouldPreSelect = expectMultipleResults(query);
  const [dataSets, setDataSets] = useTabState<PartialRecord<string, Loadable<PSDataSet>>>(
    `${page}_dataSets`,
    activeTab,
    {},
  );
  const [tableConfigs, setTableConfigs] = useTabState<PartialRecord<string, TableConfig>>(
    `${page}_tableConfigs`,
    activeTab,
    {},
  );

  const runPreQuery = async () => {
    setDataSets({ search: null });

    const fields = ["Name", "DistinguishedName", "Enabled", "SamAccountName", "UserPrincipalName"];
    invokePSCommand({
      command: `Get-AdUser -Filter {${query.filter.name}} -Properties ${fields.join(",")}`,
      fields,
    }).then((response) => {
      setDataSets({ search: response });
    });

    setActiveTabTitle("Search Results");
    setTableConfigs(softResetTables(tableConfigs));
  };

  const runQuery = async (query: AdQuery, resetSearch?: boolean) => {
    // If resetSearch is true, the dataSets.search should be reset -> incremental = false
    setDataSets({ attributes: null, groups: null }, !resetSearch);

    invokePSCommand({
      command: `Get-AdUser -Identity ${query.filter.name} -Properties *`,
    }).then((response) => {
      setDataSets({ attributes: firsObjectToPSDataSet(response) }, true);
    });

    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership -Identity ${query.filter.name}`,
      fields: ["Name", "GroupCategory", "DistinguishedName"],
    }).then((response) => {
      setDataSets({ groups: response }, true);
    });

    setActiveTabTitle(query.filter.name || "User");
    setTableConfigs(softResetTables(tableConfigs, ["attributes", "groups"]));
  };

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} setTabs={setTabs} />

      <div className="px-2">
        <AdQuery
          query={query}
          setQuery={setQuery}
          onSubmit={() => (shouldPreSelect ? runPreQuery() : runQuery(query, true))}
        />

        {dataSets?.search && (
          <Table
            title="Search Results"
            dataSet={dataSets.search}
            config={tableConfigs.search ?? tableConfig}
            setConfig={(config) => setTableConfigs({ search: config }, true)}
            onRedirect={(row: PSResult & { Name?: string }) => {
              runQuery({
                ...query,
                filter: {
                  name: row.Name ?? "",
                },
              });
            }}
          />
        )}

        <Table
          title="User Attributes"
          dataSet={dataSets?.attributes}
          config={tableConfigs?.attributes ?? tableConfig}
          setConfig={(config) => setTableConfigs({ attributes: config }, true)}
        />

        <Table
          title="User Groups"
          dataSet={dataSets.groups}
          config={tableConfigs.groups ?? tableConfig}
          setConfig={(config) => setTableConfigs({ groups: config }, true)}
        />
      </div>
    </div>
  );
}
