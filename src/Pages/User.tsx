import { getMultipleUsers, getSingleUser } from "../Api/user";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery } from "../Helper/utils";

import Query from "../Components/Query/Query";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "groups"], undefined);

    const { users } = await getMultipleUsers(query);

    updateTab({ icon: "search" });
    setResult("search", users);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "groups"], null);

    const { attributes, groups } = await getSingleUser(query);

    updateTab({ icon: "user" });
    setResult("attributes", attributes);
    setResult("groups", groups);
  };

  onRedirect(() => runQuery(query, true));

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
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
          title="Groups"
          page={page}
          tabId={tabId}
          name="groups"
          onRedirect={(row: PSResult & { Name?: string; _Server?: string }) => {
            redirect("group", {
              filters: [{ property: "Name", value: row.Name ?? "" }],
              servers: [row._Server ?? ""],
            });
          }}
        />
      </div>
    </div>
  );
}
