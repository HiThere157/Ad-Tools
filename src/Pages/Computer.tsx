import { getMultipleComputers, getSingleComputer } from "../Api/computer";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery } from "../Helper/utils";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function Computer() {
  const page = "computer";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["dns", "attributes", "memberof"], undefined);

    const { computers } = await getMultipleComputers(query);

    updateTab({ icon: "search" });
    setResult("search", computers);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["dns", "attributes", "memberof"], null);

    const { dns, attributes, memberof } = await getSingleComputer(query);

    updateTab({ icon: "computer" });
    setResult("dns", dns);
    setResult("attributes", attributes);
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
        <Table page={page} tabId={tabId} name="dns" title="DNS" />
        <Table page={page} tabId={tabId} name="attributes" title="Attributes" />
        <Table
          page={page}
          tabId={tabId}
          name="memberof"
          title="Group Memberships"
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
