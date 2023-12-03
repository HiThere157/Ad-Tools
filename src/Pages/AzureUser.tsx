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
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "memberof", "devices"], undefined);

    const { users } = await getMultipleAzureUsers(searchString);

    updateTab({ icon: "search" });
    setResult("search", users);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const objectId = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: objectId || "Azure User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "memberof", "devices"], null);

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const { attributes } = await getSingleAzureUser(objectId);
    if (attributes?.error) return runSearchQuery(query);

    const { memberof, devices } = await getSingleAzureUserDetails(objectId);

    updateTab({ icon: "user" });
    setResult("attributes", attributes);
    setResult("memberof", memberof);
    setResult("devices", devices);
  };

  onRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="User Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
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
