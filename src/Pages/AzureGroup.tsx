import { AzureGroupTables, Pages } from "../Config/const";
import { searchAzureGroups, getAzureGroup, getAzureGroupId } from "../Api/azureGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureGroup() {
  const page = Pages.AzureGroup;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AzureGroupTables.Search, null);
    setDataSet([AzureGroupTables.Attributes, AzureGroupTables.Members], undefined);

    const { search } = searchAzureGroups(searchString, columns[AzureGroupTables.Search]);

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

    const { attributes, members } = getAzureGroup(objectId, columns[AzureGroupTables.Members]);

    setDataSet(AzureGroupTables.Attributes, attributes);
    setDataSet(AzureGroupTables.Members, members);
    Promise.all([attributes, members]).then(() => updateTab({ icon: "group" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Group Search Results"
        page={page}
        tabId={tabId}
        name={AzureGroupTables.Search}
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
      <Table title="Attributes" page={page} tabId={tabId} name={AzureGroupTables.Attributes} />
      <Table
        title="Members"
        page={page}
        tabId={tabId}
        name={AzureGroupTables.Members}
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
