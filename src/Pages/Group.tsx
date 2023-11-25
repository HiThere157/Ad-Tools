import { getMultipleGroups, getSingleGroup } from "../Api/group";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery } from "../Helper/utils";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
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
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

        {shouldPreQuery(query) && (
          <Table
            page={page}
            tabId={tabId}
            name="search"
            title="Search Results"
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
        )}
        <Table page={page} tabId={tabId} name="attributes" title="Attributes" />
        <Table
          page={page}
          tabId={tabId}
          name="members"
          title="Members"
          onRedirect={(row: PSResult & { Name?: string; _Server?: string }) => {
            redirect("user", {
              filters: [{ property: "Name", value: row.Name ?? "" }],
              servers: [row._Server ?? ""],
            });
          }}
        />
        <Table
          page={page}
          tabId={tabId}
          name="memberof"
          title="Group Memberships"
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
      </div>
    </div>
  );
}
