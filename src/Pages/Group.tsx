import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery, getPSFilter, mergeResponses, removeDuplicates } from "../Helper/utils";
import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function Group() {
  const page = "group";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult, softResetTableConfig } = useTabState(page);

  const runPreQuery = (query: AdQuery) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult("attributes", undefined);
    setResult("members", undefined);

    const selectFields = removeDuplicates(
      ["Name", "Description"],
      query.filters.map(({ property }) => property),
    );
    Promise.all(
      query.servers.map((server) =>
        invokePSCommand({
          command: `Get-AdGroup \
          -Filter "${getPSFilter(query.filters)}" \
          -Server ${server} \
          -Properties ${selectFields.join(",")}`,
          selectFields,
        }).then((response) => addServerToResponse(response, server, true)),
      ),
    ).then((responses) => {
      updateTab({ icon: "search" });
      setResult("search", mergeResponses(responses));
      softResetTableConfig("search");
    });
  };

  const runQuery = (query: AdQuery, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

    updateTab({ icon: "loading", title: identity || "Group" });
    if (resetSearch) setResult("search", undefined);
    setResult("attributes", null);
    setResult("members", null);

    Promise.all([
      invokePSCommand({
        command: `Get-AdGroup \
        -Identity ${identity} \
        -Server ${query.servers[0]} \
        -Properties *`,
      }).then((response) => {
        setResult("attributes", extractFirstObject(response));
        softResetTableConfig("attributes");
      }),
      invokePSCommand({
        command: `Get-ADGroupMember \
        -Identity ${identity} \
        -Server ${query.servers[0]}`,
        selectFields: ["Name", "ObjectClass"],
      }).then((response) => {
        setResult("members", addServerToResponse(response, query.servers[0]));
        softResetTableConfig("members");
      }),
    ]).then(() => updateTab({ icon: "group" }));
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
      </div>
    </div>
  );
}
