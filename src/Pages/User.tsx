import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { updateTab } from "../Redux/tabs";
import { setResult } from "../Redux/data";
import { defaultAdQuery } from "../Config/default";
import {
  expectMultipleResults,
  getPSFilterString,
  mergeResponses,
  removeDuplicates,
} from "../Helper/utils";
import { invokePSCommand } from "../Helper/api";
import { addServerToResult, firsObjectToPSDataSet } from "../Helper/postProcessors";

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

  const runPreQuery = async () => {
    dispatch(updateTab({ page, tabId, tab: { icon: "loading", title: "Search Results" } }));
    dispatch(setResult({ page, tabId, name: "search", result: null }));

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
        dispatch(setResult({ page, tabId, name: "search", result: mergeResponses(responses) }));
        dispatch(updateTab({ page, tabId, tab: { icon: "search" } }));
      })
      .catch(() => {
        dispatch(updateTab({ page, tabId, tab: { icon: "error" } }));
      });
  };

  const runQuery = async (tabQuery: AdQuery, resetSearch?: boolean) => {
    dispatch(
      updateTab({ page, tabId, tab: { icon: "loading", title: tabQuery.filter.Name || "User" } }),
    );
    dispatch(setResult({ page, tabId, name: "attributes", result: null }));
    dispatch(setResult({ page, tabId, name: "groups", result: null }));
    if (resetSearch) dispatch(setResult({ page, tabId, name: "search", result: null }));

    invokePSCommand({
      command: `Get-AdUser \
        -Identity ${tabQuery.filter.Name} \
        -Server ${tabQuery.servers[0]} \
        -Properties *`,
    })
      .then((response) => {
        dispatch(
          setResult({ page, tabId, name: "attributes", result: firsObjectToPSDataSet(response) }),
        );
        dispatch(updateTab({ page, tabId, tab: { icon: "user" } }));
      })
      .catch(() => {
        dispatch(updateTab({ page, tabId, tab: { icon: "error" } }));
      });

    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
        -Identity ${tabQuery.filter.Name} \
        -Server ${tabQuery.servers[0]}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    })
      .then((response) => {
        dispatch(setResult({ page, tabId, name: "groups", result: response }));
      })
      .catch(() => {
        dispatch(updateTab({ page, tabId, tab: { icon: "error" } }));
      });
  };

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery
          page={page}
          tabId={tabId}
          onSubmit={() => (expectMultipleResults(tabQuery) ? runPreQuery() : runQuery(tabQuery))}
        />

        {expectMultipleResults(tabQuery) && (
          <Table page={page} tabId={tabId} name="search" title="Search Results" />
        )}
        <Table page={page} tabId={tabId} name="attributes" title="Attributes" />
        <Table page={page} tabId={tabId} name="groups" title="Groups" />
      </div>
    </div>
  );
}
