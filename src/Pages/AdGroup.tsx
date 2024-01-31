import { AdGroupTables, Pages } from "../Config/const";
import { searchAdGroups, getAdGroup } from "../Api/adGroup";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function AdGroup() {
  const page = Pages.AdGroup;
  const { redirect, useOnRedirect } = useRedirect();
  const {
    query,
    isLocked,
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
    setDataSet(AdGroupTables.Search, null);
    setDataSet(
      [AdGroupTables.Attributes, AdGroupTables.Members, AdGroupTables.Memberof],
      undefined,
    );

    const { search } = searchAdGroups(filters, servers, tableColumns[AdGroupTables.Search]);

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
      tableColumns[AdGroupTables.Members],
      tableColumns[AdGroupTables.Memberof],
    );

    setDataSet(AdGroupTables.Attributes, attributes);
    setDataSet(AdGroupTables.Members, members);
    setDataSet(AdGroupTables.Memberof, memberof);
    Promise.all([attributes, members, memberof]).then(() => updateTab({ icon: "group" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="ad" />
      <AdQuery
        query={query}
        isLocked={isLocked}
        setQuery={setQuery}
        onSubmit={() => runQuery(query, true)}
      />

      <Table
        title="Group Search Results"
        dataSet={dataSets[AdGroupTables.Search]}
        tableState={tableStates[AdGroupTables.Search]}
        setTableState={(tableState) => setTableState(AdGroupTables.Search, tableState)}
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
        dataSet={dataSets[AdGroupTables.Attributes]}
        tableState={tableStates[AdGroupTables.Attributes]}
        setTableState={(tableState) => setTableState(AdGroupTables.Attributes, tableState)}
      />
      <Table
        title="Members"
        dataSet={dataSets[AdGroupTables.Members]}
        tableState={tableStates[AdGroupTables.Members]}
        setTableState={(tableState) => setTableState(AdGroupTables.Members, tableState)}
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
        dataSet={dataSets[AdGroupTables.Memberof]}
        tableState={tableStates[AdGroupTables.Memberof]}
        setTableState={(tableState) => setTableState(AdGroupTables.Memberof, tableState)}
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
