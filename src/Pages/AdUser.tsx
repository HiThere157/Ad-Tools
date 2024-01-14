import { AdUserTables, Pages } from "../Config/const";
import { searchAdUsers, getAdUser } from "../Api/adUser";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdUser() {
  const page = Pages.AdUser;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AdUserTables.Search, null);
    setDataSet([AdUserTables.Attributes, AdUserTables.Memberof], undefined);

    const { search } = searchAdUsers(filters, servers, columns[AdUserTables.Search]);

    setDataSet(AdUserTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setDataSet(AdUserTables.Search, undefined);
    setDataSet([AdUserTables.Attributes, AdUserTables.Memberof], null);

    const { attributes, memberof } = getAdUser(identity, server, columns.memberof);

    setDataSet(AdUserTables.Attributes, attributes);
    setDataSet(AdUserTables.Memberof, memberof);
    Promise.all([attributes, memberof]).then(() => updateTab({ icon: "user" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="User Search Results"
        page={page}
        tabId={tabId}
        name={AdUserTables.Search}
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

      <Table title="Attributes" page={page} tabId={tabId} name={AdUserTables.Attributes} />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name={AdUserTables.Memberof}
        redirectColumn="Name"
        onRedirect={(row) => {
          redirect(Pages.AdGroup, {
            filters: [{ property: "Name", value: row.Name ?? "" }],
            servers: [row._Server],
          });
        }}
      />
    </TabLayout>
  );
}
