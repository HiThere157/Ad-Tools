import { getMultipleAzureGroups, getSingleAzureGroup } from "../Api/azureGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureGroup() {
  const page = "azureGroup";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "members"], undefined);

    const { users } = await getMultipleAzureGroups(query);
    if (users?.result?.data?.[0]?.DisplayName === identity) return runQuery(query);

    updateTab({ icon: "search" });
    setResult("search", users);
  };

  const runQuery = async (query: Query) => {
    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: identity || "Azure Group" });
    setResult(["attributes", "members"], null);

    const { attributes, members } = await getSingleAzureGroup(query);

    updateTab({ icon: "group" });
    setResult("attributes", attributes);
    setResult("members", members);
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
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runSearchQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
      <Table
        title="Members"
        page={page}
        tabId={tabId}
        name="members"
        onRedirect={(row) => {
          redirect("azureUser", {
            filters: [{ property: "Name", value: row.UserPrincipalName ?? "" }],
            servers: [],
          });
        }}
      />
    </TabLayout>
  );
}
