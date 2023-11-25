import { getMultipleAdGroups, getSingleAdGroup } from "../Api/adGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldPreQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdGroup() {
  const page = "adGroup";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "members", "memberof"], undefined);

    const { groups } = await getMultipleAdGroups(query);

    updateTab({ icon: "search" });
    setResult("search", groups);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: identity || "Group" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "members", "memberof"], null);

    const { attributes, members, memberof } = await getSingleAdGroup(query);

    updateTab({ icon: "group" });
    setResult("attributes", attributes);
    setResult("members", members);
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

          if (newTab) {
            redirect(page, newQuery);
          } else {
            runQuery(newQuery);
          }
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
      <Table
        title="Members"
        page={page}
        tabId={tabId}
        name="members"
        onRedirect={(row: PSResult & { Name?: string; _Server?: string }) => {
          redirect("adUser", {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server ?? ""],
          });
        }}
      />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name="memberof"
        onRedirect={(row: PSResult & { Name?: string; _Server?: string }, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server ?? ""],
          };

          if (newTab) {
            redirect(page, newQuery);
          } else {
            runQuery(newQuery);
          }
        }}
      />
    </TabLayout>
  );
}
