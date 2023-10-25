import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { shouldPreQuery, getPSFilter, mergeResponses, removeDuplicates } from "../Helper/utils";
import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function Computer() {
  const page = "computer";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runPreQuery = async (query: AdQuery) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult("dns", undefined);
    setResult("attributes", undefined);
    setResult("groups", undefined);

    const selectFields = removeDuplicates(
      ["Name", "DisplayName"],
      query.filters.map(({ property }) => property),
    );
    const responses = await Promise.all(
      query.servers.map((server) =>
        invokePSCommand({
          command: `Get-AdComputer \
          -Filter "${getPSFilter(query.filters)}" \
          -Server ${server} \
          -Properties ${selectFields.join(",")}`,
          selectFields,
        }).then((response) => addServerToResponse(response, server, true)),
      ),
    );

    updateTab({ icon: "search" });
    setResult("search", mergeResponses(responses), true);
  };

  const runQuery = async (query: AdQuery, resetSearch?: boolean) => {
    if (shouldPreQuery(query)) return runPreQuery(query);

    const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setResult("search", undefined);
    setResult("dns", null);
    setResult("attributes", null);
    setResult("groups", null);

    const [dns, attributes, groups] = await Promise.all([
      invokePSCommand({
        command: `Resolve-DnsName -Name ${identity}.${query.servers[0]}`,
        selectFields: ["Name", "Type", "IPAddress"],
      }),
      invokePSCommand({
        command: `Get-AdComputer \
        -Identity ${identity} \
        -Server ${query.servers[0]} \
        -Properties *`,
      }),
      invokePSCommand({
        command: `Get-AdPrincipalGroupMembership \
        (Get-AdComputer -Identity ${identity} -Server ${query.servers[0]}) \
        -Server ${query.servers[0]}`,
        selectFields: ["Name", "GroupCategory", "DistinguishedName"],
      }),
    ]);

    updateTab({ icon: "computer" });
    setResult("dns", dns, true);
    setResult("attributes", extractFirstObject(attributes), true);
    setResult("groups", addServerToResponse(groups, query.servers[0]), true);
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
          name="groups"
          title="Groups"
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
