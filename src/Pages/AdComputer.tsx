import { getMultipleAdComputers, getSingleAdComputer } from "../Api/adComputer";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldPreQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdComputer() {
  const page = "adComputer";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["dns", "attributes", "memberof"], undefined);

    const { computers } = await getMultipleAdComputers(query);

    updateTab({ icon: "search" });
    setResult("search", computers);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["dns", "attributes", "memberof"], null);

    const { dns, attributes, memberof } = await getSingleAdComputer(query);

    updateTab({ icon: "computer" });
    setResult("dns", dns);
    setResult("attributes", attributes);
    setResult("memberof", memberof);
  };

  onRedirect(() => runQuery(query, true));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
        onRedirect={(row: PSResult & { Name?: string; _Server?: string }, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server ?? ""],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="DNS" page={page} tabId={tabId} name="dns" />
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name="memberof"
        onRedirect={(row: PSResult & { Name?: string; _Server?: string }) => {
          redirect("adGroup", {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server ?? ""],
          });
        }}
      />
    </TabLayout>
  );
}
