import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult, softResetTableConfig } from "../Redux/data";
import { defaultAdQuery } from "../Config/default";
import {
  expectMultipleResults,
  getPSFilterString,
  mergeResponses,
  removeDuplicates,
} from "../Helper/utils";
import { invokePSCommand } from "../Helper/api";
import { addServerToResult, extractFirstObject } from "../Helper/postProcessors";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";
import Table from "../Components/Table/Table";

export default function User() {
  const page = "user";
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

  const runPreQuery = async () => {
    updatePageTab({ icon: "loading", title: "Search Results" });
    setTabResult("search", null);
    setTabResult("attributes", undefined);
    setTabResult("groups", undefined);

    const selectFields = removeDuplicates(["Name", "DisplayName"], Object.keys(tabQuery.filter));
    const responses = tabQuery.servers.map((server) =>
      invokePSCommand({
        command: `Get-AdUser \
          -Filter "${getPSFilterString(tabQuery.filter)}" \
          -Server ${server} \
          -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResult(response, server)),
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
    updatePageTab({ icon: "loading", title: tabQuery.filter.Name || "User" });
    if (resetSearch) setTabResult("search", undefined);
    setTabResult("attributes", null);
    setTabResult("groups", null);

    Promise.all([
      invokePSCommand({
        command: `Get-AdUser \
        -Identity ${tabQuery.filter.Name} \
        -Server ${tabQuery.servers[0]} \
        -Properties *`,
      }).then((response) => {
        setTabResult("attributes", extractFirstObject(response));
        softResetTabTableConfig("attributes");
      }),
      invokePSCommand({
        command: `Get-AdPrincipalGroupMembership \
        -Identity ${tabQuery.filter.Name} \
        -Server ${tabQuery.servers[0]}`,
        selectFields: ["Name", "GroupCategory", "DistinguishedName"],
      }).then((response) => {
        setTabResult("groups", response);
        softResetTabTableConfig("groups");
      }),
    ])
      .then(() => updatePageTab({ icon: "user" }))
      .catch(() => updatePageTab({ icon: "error" }));
  };

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery
          page={page}
          tabId={tabId}
          onSubmit={() =>
            expectMultipleResults(tabQuery) ? runPreQuery() : runQuery(tabQuery, true)
          }
        />

        {expectMultipleResults(tabQuery) && (
          <Table
            page={page}
            tabId={tabId}
            name="search"
            title="Search Results"
            onRedirect={(row: PSResult & { Name?: string; _Server?: string }) => {
              runQuery({
                isAdvanced: false,
                filter: { Name: row.Name ?? "" },
                servers: [row._Server ?? ""],
              });
            }}
          />
        )}
        <Table page={page} tabId={tabId} name="attributes" title="Attributes" />
        <Table page={page} tabId={tabId} name="groups" title="Groups" />
      </div>
    </div>
  );
}
