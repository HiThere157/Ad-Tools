import { AdGroupTables, Pages } from "../Config/const";
import { searchAdGroups, getAdGroup } from "../Api/adGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdGroup() {
  const page = Pages.AdGroup;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AdGroupTables.Search, null);
    setDataSet(
      [AdGroupTables.Attributes, AdGroupTables.Members, AdGroupTables.Memberof],
      undefined,
    );

    const { search } = searchAdGroups(filters, servers, columns[AdGroupTables.Search]);

    setDataSet(AdGroupTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "Group" });
    if (resetSearch) setDataSet(AdGroupTables.Search, undefined);
    setDataSet([AdGroupTables.Attributes, AdGroupTables.Members, AdGroupTables.Memberof], null);

    const { attributes, members, memberof } = getAdGroup(
      identity,
      server,
      columns[AdGroupTables.Members],
      columns[AdGroupTables.Memberof],
    );

    setDataSet(AdGroupTables.Attributes, attributes);
    setDataSet(AdGroupTables.Members, members);
    setDataSet(AdGroupTables.Memberof, memberof);
    Promise.all([attributes, members, memberof]).then(() => updateTab({ icon: "group" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Group Search Results"
        page={page}
        tabId={tabId}
        name={AdGroupTables.Search}
        isSearchTable={true}
        redirectColumn="Name"
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name={AdGroupTables.Attributes} />
      <Table
        title="Members"
        page={page}
        tabId={tabId}
        name={AdGroupTables.Members}
        redirectColumn="Name"
        onRedirect={(row) => {
          redirect(Pages.AdUser, {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
          });
        }}
      />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name={AdGroupTables.Memberof}
        redirectColumn="Name"
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
    </TabLayout>
  );
}
