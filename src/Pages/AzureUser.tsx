import { getMultipleAzureUsers, getSingleAzureUser } from "../Api/azureUser";
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
    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "memberof", "devices"], undefined);

    const { users } = await getMultipleAzureUsers(query);
    if (users?.result?.data?.[0]?.UserPrincipalName === identity) return runQuery(query);

    updateTab({ icon: "search" });
    setResult("search", users);
  };

  const runQuery = async (query: Query) => {
    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: identity || "Azure User" });
    setResult(["attributes", "memberof", "devices"], null);

    const { attributes, memberof, devices } = await getSingleAzureUser(query);

    updateTab({ icon: "user" });
    setResult("attributes", attributes);
    setResult("memberof", memberof);
    setResult("devices", devices);
  };

  onRedirect(() => runSearchQuery(query));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runSearchQuery(query)} />

      <Table
        title="Search Results"
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
          runSearchQuery(newQuery);
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
      <Table title="Devices" page={page} tabId={tabId} name="devices" />
    </TabLayout>
  );
}
