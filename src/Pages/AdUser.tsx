import { getMultipleAdUsers, getSingleAdUser } from "../Api/adUser";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdUser() {
  const page = "adUser";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "memberof"], undefined);

    const { users } = getMultipleAdUsers(filters, servers);

    setResult("search", users);
    Promise.all([users]).then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "memberof"], null);

    const { attributes, memberof } = getSingleAdUser(identity, server);

    setResult("attributes", attributes);
    setResult("memberof", memberof);
    Promise.all([attributes, memberof]).then(() => updateTab({ icon: "user" }));
  };

  onRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="User Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
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
          redirect("adGroup", {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
          });
        }}
      />
    </TabLayout>
  );
}
