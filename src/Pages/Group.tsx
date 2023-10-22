import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult, softResetTableConfig } from "../Redux/data";
import { defaultAdQuery } from "../Config/default";
import { useRedirect } from "../Hooks/useRedirect";
import {
  expectMultipleResults,
  getPSFilterString,
  mergeResponses,
  removeDuplicates,
} from "../Helper/utils";
import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function Group() {
  const page = "group";
  const { redirect, onRedirect } = useRedirect();
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  const tabId = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[tabId] ?? defaultAdQuery;

  const updatePageTab = (tab: Partial<Tab>) => dispatch(updateTab({ page, tabId, tab }));
  const setTabResult = (name: string, result: Loadable<PSDataSet>) =>
    dispatch(setResult({ page, tabId, name, result }));
  const softResetTabTableConfig = (name: string) =>
    dispatch(softResetTableConfig({ page, tabId, name }));

  const runPreQuery = async (tabQuery: AdQuery) => {
    updatePageTab({ icon: "loading", title: "Search Results" });
    setTabResult("search", null);
    setTabResult("attributes", undefined);
    setTabResult("members", undefined);

    const selectFields = removeDuplicates(
      ["Name", "Description"],
      tabQuery.filters.map(({ property }) => property),
    );
    const responses = tabQuery.servers.map((server) =>
      invokePSCommand({
        command: `Get-AdGroup \
          -Filter "${getPSFilterString(tabQuery.filters)}" \
          -Server ${server} \
          -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server)),
    );

    Promise.all(responses)
      .then((responses) => {
        updatePageTab({ icon: "search" });
        setTabResult("search", mergeResponses(responses));
        softResetTabTableConfig("search");
      })
      .catch(() => updatePageTab({ icon: "error" }));
  };

  const runQuery = async (tabQuery: AdQuery, resetSearch?: boolean) => {
    if (expectMultipleResults(tabQuery)) return runPreQuery(tabQuery);

    const identity = tabQuery.filters.find(({ property }) => property === "Name")?.value ?? "";

    updatePageTab({ icon: "loading", title: identity || "Group" });
    if (resetSearch) setTabResult("search", undefined);
    setTabResult("attributes", null);
    setTabResult("members", null);

    Promise.all([
      invokePSCommand({
        command: `Get-AdGroup \
        -Identity ${identity} \
        -Server ${tabQuery.servers[0]} \
        -Properties *`,
      }).then((response) => {
        setTabResult("attributes", extractFirstObject(response));
        softResetTabTableConfig("attributes");
      }),
      invokePSCommand({
        command: `Get-ADGroupMember \
        -Identity ${identity} \
        -Server ${tabQuery.servers[0]}`,
        selectFields: ["Name", "DisplayName", "ObjectClass"],
      }).then((response) => {
        setTabResult("members", addServerToResponse(response, tabQuery.servers[0]));
        softResetTabTableConfig("members");
      }),
    ])
      .then(() => updatePageTab({ icon: "group" }))
      .catch(() => updatePageTab({ icon: "error" }));
  };

  onRedirect(() => runQuery(tabQuery, true));

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(tabQuery, true)} />

        {expectMultipleResults(tabQuery) && (
          <Table
            page={page}
            tabId={tabId}
            name="search"
            title="Search Results"
            onRedirect={(row: PSResult & { Name?: string; _Server?: string }, newTab) => {
              const newQuery = {
                isAdvanced: false,
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
              isAdvanced: false,
              filters: [{ property: "Name", value: row.Name ?? "" }],
              servers: [row._Server ?? ""],
            });
          }}
        />
      </div>
    </div>
  );
}
