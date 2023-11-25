import { getMultipleGroups, getSingleGroup } from "../Api/group";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import Query from "../Components/Query/Query";
import Table from "../Components/Table/Table";

export default function Group() {
  const page = "group";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "members", "memberof"], undefined);

    const { groups } = await getMultipleGroups(query);

    updateTab({ icon: "search" });
    setResult("search", groups);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

    updateTab({ icon: "loading", title: identity || "Group" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "members", "memberof"], null);

    const { attributes, members, memberof } = await getSingleGroup(query);

    updateTab({ icon: "group" });
    setResult("attributes", attributes);
    setResult("members", members);
    setResult("memberof", memberof);
  };

  onRedirect(() => runQuery(query, true));

  return (
    <TabLayout page={page}>
      <Query page={page} tabId={tabId} type="ad" onSubmit={() => runQuery(query, true)} />

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
          redirect("user", {
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
