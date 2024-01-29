import { AdReplicationTables, Pages } from "../Config/const";
import { getAdReplication } from "../Api/adReplication";
import { searchAdObjects } from "../Api/adObject";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function AdReplication() {
  const page = Pages.AdReplication;
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
    setDataSet(AdReplicationTables.Search, null);
    setDataSet(AdReplicationTables.Attributes, undefined);

    const { search } = searchAdObjects(filters, servers, tableColumns[AdReplicationTables.Search]);

    setDataSet(AdReplicationTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setDataSet(AdReplicationTables.Search, undefined);
    setDataSet(AdReplicationTables.Attributes, null);

    const { attributes } = getAdReplication(
      identity,
      server,
      tableColumns[AdReplicationTables.Attributes],
    );

    setDataSet(AdReplicationTables.Attributes, attributes);
    attributes.then(() => updateTab({ icon: "replication" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="ad" />
      <AdQuery query={query} setQuery={setQuery} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Object Search Results"
        dataSet={dataSets[AdReplicationTables.Search]}
        tableState={tableStates[AdReplicationTables.Search]}
        setTableState={(state) => setTableState(AdReplicationTables.Search, state)}
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
        title="Replication Attributes"
        dataSet={dataSets[AdReplicationTables.Attributes]}
        tableState={tableStates[AdReplicationTables.Attributes]}
        setTableState={(state) => setTableState(AdReplicationTables.Attributes, state)}
      />
    </TabLayout>
  );
}
