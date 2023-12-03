import { getMultipleAdReplicationTargets, getSingleAdReplication } from "../Api/adReplication";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdReplication() {
  const page = "adUser";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult("attributes", undefined);

    const { objects } = await getMultipleAdReplicationTargets(filters, servers);

    updateTab({ icon: "search" });
    setResult("search", objects);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult("attributes", null);

    const { attributes } = await getSingleAdReplication(identity, server);

    updateTab({ icon: "replication" });
    setResult("attributes", attributes);
  };

  onRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Object Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server ?? ""],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />

      <Table title="Replication Attributes" page={page} tabId={tabId} name="attributes" />
    </TabLayout>
  );
}
