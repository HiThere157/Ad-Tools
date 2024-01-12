import {
  getMultipleAzureUsers,
  getSingleAzureUser,
  getSingleAzureUserDetails,
} from "../Api/azureUser";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureUser() {
  const page = "azureUser";
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet("search", null);
    setDataSet(["attributes", "memberof", "devices"], undefined);

    const { users } = getMultipleAzureUsers(searchString);

    setDataSet("search", users);
    users.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const objectId = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: objectId || "Azure User" });
    if (resetSearch) setDataSet("search", undefined);
    setDataSet(["attributes", "memberof", "devices"], null);

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const { attributes } = await getSingleAzureUser(objectId);
    if (attributes?.error) return runSearchQuery(query);

    const { memberof, devices } = getSingleAzureUserDetails(objectId);

    setDataSet("attributes", attributes);
    setDataSet("memberof", memberof);
    setDataSet("devices", devices);
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
        name="search"
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
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name="memberof"
        redirectColumn="DisplayName"
        onRedirect={(row) => {
          redirect("azureGroup", {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          });
        }}
      />
      <Table
        title="Devices"
        page={page}
        tabId={tabId}
        name="devices"
        redirectColumn="DisplayName"
        onRedirect={(row) => {
          redirect("azureDevice", {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          });
        }}
      />
    </TabLayout>
  );
}
