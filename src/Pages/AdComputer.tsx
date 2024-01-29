import { AdComputerTables, Pages } from "../Config/const";
import { searchAdComputers, getAdComputer } from "../Api/adComputer";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function AdComputer() {
  const page = Pages.AdComputer;
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
    setDataSet(AdComputerTables.Search, null);
    setDataSet(
      [AdComputerTables.Dns, AdComputerTables.Attributes, AdComputerTables.Memberof],
      undefined,
    );

    const { search } = searchAdComputers(filters, servers, tableColumns[AdComputerTables.Search]);

    setDataSet(AdComputerTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "User" });
    if (resetSearch) setDataSet(AdComputerTables.Search, undefined);
    setDataSet(
      [AdComputerTables.Dns, AdComputerTables.Attributes, AdComputerTables.Memberof],
      null,
    );

    const { dns, attributes, memberof } = getAdComputer(
      identity,
      server,
      tableColumns[AdComputerTables.Dns],
      tableColumns[AdComputerTables.Memberof],
    );

    setDataSet(AdComputerTables.Dns, dns);
    setDataSet(AdComputerTables.Attributes, attributes);
    setDataSet(AdComputerTables.Memberof, memberof);
    Promise.all([dns, attributes, memberof]).then(() => updateTab({ icon: "computer" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="ad" />
      <AdQuery query={query} setQuery={setQuery} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Computer Search Results"
        dataSet={dataSets[AdComputerTables.Search]}
        tableState={tableStates[AdComputerTables.Search]}
        setTableState={(tableState) => setTableState(AdComputerTables.Search, tableState)}
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
        title="DNS"
        dataSet={dataSets[AdComputerTables.Dns]}
        tableState={tableStates[AdComputerTables.Dns]}
        setTableState={(tableState) => setTableState(AdComputerTables.Dns, tableState)}
      />
      <Table
        title="Attributes"
        dataSet={dataSets[AdComputerTables.Attributes]}
        tableState={tableStates[AdComputerTables.Attributes]}
        setTableState={(tableState) => setTableState(AdComputerTables.Attributes, tableState)}
      />
      <Table
        title="Group Memberships"
        dataSet={dataSets[AdComputerTables.Memberof]}
        tableState={tableStates[AdComputerTables.Memberof]}
        setTableState={(tableState) => setTableState(AdComputerTables.Memberof, tableState)}
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
