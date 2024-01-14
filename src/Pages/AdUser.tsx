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
  const {
    query,
    dataSets,
    tableStates,
    tableColumns,
    updateTab,
    setQuery,
    setDataSet,
    setTableState,
  } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AdUserTables.Search, null);
    setDataSet([AdUserTables.Attributes, AdUserTables.Memberof], undefined);

    const { search } = searchAdUsers(filters, servers, tableColumns[AdUserTables.Search]);

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

    const { attributes, memberof } = getAdUser(
      identity,
      server,
      tableColumns[AdUserTables.Memberof],
    );

    setDataSet(AdUserTables.Attributes, attributes);
    setDataSet(AdUserTables.Memberof, memberof);
    Promise.all([attributes, memberof]).then(() => updateTab({ icon: "user" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery query={query} setQuery={setQuery} onSubmit={() => runQuery(query, true)} />

      <Table
        title="User Search Results"
        dataSet={dataSets[AdUserTables.Search]}
        tableState={tableStates[AdUserTables.Search]}
        setTableState={(tableState) => setTableState(AdUserTables.Search, tableState)}
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
      <Table
        title="Attributes"
        dataSet={dataSets[AdUserTables.Attributes]}
        tableState={tableStates[AdUserTables.Attributes]}
        setTableState={(tableState) => setTableState(AdUserTables.Attributes, tableState)}
      />
      <Table
        title="Group Memberships"
        dataSet={dataSets[AdUserTables.Memberof]}
        tableState={tableStates[AdUserTables.Memberof]}
        setTableState={(tableState) => setTableState(AdUserTables.Memberof, tableState)}
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
