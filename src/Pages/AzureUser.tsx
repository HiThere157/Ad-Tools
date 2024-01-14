import { AzureUserTables, Pages } from "../Config/const";
import { searchAzureUsers, getAzureUser, getAzureUserDetails } from "../Api/azureUser";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureUser() {
  const page = Pages.AzureUser;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AzureUserTables.Search, null);
    setDataSet(
      [AzureUserTables.Attributes, AzureUserTables.Memberof, AzureUserTables.Devices],
      undefined,
    );

    const { search } = searchAzureUsers(searchString, columns[AzureUserTables.Search]);

    setDataSet(AzureUserTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const objectId = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: objectId || "Azure User" });
    if (resetSearch) setDataSet(AzureUserTables.Search, undefined);
    setDataSet(
      [AzureUserTables.Attributes, AzureUserTables.Memberof, AzureUserTables.Devices],
      null,
    );

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const { attributes } = await getAzureUser(objectId);
    if (attributes?.error) return runSearchQuery(query);

    const { memberof, devices } = getAzureUserDetails(
      objectId,
      columns[AzureUserTables.Memberof],
      columns[AzureUserTables.Devices],
    );

    setDataSet(AzureUserTables.Attributes, attributes);
    setDataSet(AzureUserTables.Memberof, memberof);
    setDataSet(AzureUserTables.Devices, devices);
    Promise.all([attributes, memberof, devices]).then(() => updateTab({ icon: "user" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="User Search Results"
        page={page}
        tabId={tabId}
        name={AzureUserTables.Search}
        isSearchTable={true}
        redirectColumn="UserPrincipalName"
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.UserPrincipalName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name={AzureUserTables.Attributes} />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name={AzureUserTables.Memberof}
        redirectColumn="DisplayName"
        onRedirect={(row) => {
          redirect(Pages.AzureGroup, {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          });
        }}
      />
      <Table
        title="Devices"
        page={page}
        tabId={tabId}
        name={AzureUserTables.Devices}
        redirectColumn="DisplayName"
        onRedirect={(row) => {
          redirect(Pages.AzureDevice, {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          });
        }}
      />
    </TabLayout>
  );
}
