import { AzureGroupTables, Pages } from "../Config/const";
import { searchAzureGroups, getAzureGroup, getAzureGroupId } from "../Api/azureGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function AzureGroup() {
  const page = Pages.AzureGroup;
  const { redirect, useOnRedirect } = useRedirect();
  const {
    query,
    isLocked,
    dataSets,
    tableStates,
    tableColumns,
    updateTab,
    setQuery,
    setDataSet,
    setTableState,
  } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AzureGroupTables.Search, null);
    setDataSet([AzureGroupTables.Attributes, AzureGroupTables.Members], undefined);

    const { search } = searchAzureGroups(searchString, tableColumns[AzureGroupTables.Search]);

    setDataSet(AzureGroupTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const displayName = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: displayName || "Azure Group" });
    if (resetSearch) setDataSet(AzureGroupTables.Search, undefined);
    setDataSet([AzureGroupTables.Attributes, AzureGroupTables.Members], null);

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const objectId = await getAzureGroupId(displayName);
    if (!objectId) return runSearchQuery(query);

    const { attributes, members } = getAzureGroup(objectId, tableColumns[AzureGroupTables.Members]);

    setDataSet(AzureGroupTables.Attributes, attributes);
    setDataSet(AzureGroupTables.Members, members);
    Promise.all([attributes, members]).then(() => updateTab({ icon: "group" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="azureAd" />
      <AzureQuery
        query={query}
        isLocked={isLocked}
        setQuery={setQuery}
        onSubmit={() => runQuery(query, true)}
      />

      <Table
        title="Group Search Results"
        dataSet={dataSets[AzureGroupTables.Search]}
        tableState={tableStates[AzureGroupTables.Search]}
        setTableState={(state) => setTableState(AzureGroupTables.Search, state)}
        isSearchTable={true}
        redirectColumn="DisplayName"
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table
        title="Attributes"
        dataSet={dataSets[AzureGroupTables.Attributes]}
        tableState={tableStates[AzureGroupTables.Attributes]}
        setTableState={(state) => setTableState(AzureGroupTables.Attributes, state)}
      />
      <Table
        title="Members"
        dataSet={dataSets[AzureGroupTables.Members]}
        tableState={tableStates[AzureGroupTables.Members]}
        setTableState={(state) => setTableState(AzureGroupTables.Members, state)}
        redirectColumn="UserPrincipalName"
        onRedirect={(row) => {
          redirect(Pages.AzureUser, {
            filters: [{ property: "Name", value: row.UserPrincipalName ?? "" }],
            servers: [],
          });
        }}
      />
    </TabLayout>
  );
}
