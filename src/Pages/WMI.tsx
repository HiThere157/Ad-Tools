import { Pages, WmiTables } from "../Config/const";
import { searchAdComputers } from "../Api/adComputer";
import { getWmiInfo } from "../Api/wmi";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function Printers() {
  const page = Pages.Wmi;
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
    setDataSet(WmiTables.Search, null);
    setDataSet(
      [WmiTables.Monitors, WmiTables.Sysinfo, WmiTables.Software, WmiTables.Bios],
      undefined,
    );

    const { search } = searchAdComputers(filters, servers, tableColumns[WmiTables.Search]);

    setDataSet(WmiTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "WMI" });
    if (resetSearch) setDataSet(WmiTables.Search, undefined);
    setDataSet([WmiTables.Monitors, WmiTables.Sysinfo, WmiTables.Software, WmiTables.Bios], null);

    const { monitors, sysinfo, software, bios } = getWmiInfo(
      identity,
      server,
      tableColumns[WmiTables.Monitors],
      tableColumns[WmiTables.Software],
    );

    setDataSet(WmiTables.Monitors, monitors);
    setDataSet(WmiTables.Sysinfo, sysinfo);
    setDataSet(WmiTables.Software, software);
    setDataSet(WmiTables.Bios, bios);
    Promise.all([monitors, sysinfo, software, bios]).then(() => updateTab({ icon: "wmi" }));
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
        title="Computer Search Results"
        dataSet={dataSets[WmiTables.Search]}
        tableState={tableStates[WmiTables.Search]}
        setTableState={(tableState) => setTableState(WmiTables.Search, tableState)}
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
        title="Monitors"
        dataSet={dataSets[WmiTables.Monitors]}
        tableState={tableStates[WmiTables.Monitors]}
        setTableState={(tableState) => setTableState(WmiTables.Monitors, tableState)}
      />
      <Table
        title="Sysinfo"
        dataSet={dataSets[WmiTables.Sysinfo]}
        tableState={tableStates[WmiTables.Sysinfo]}
        setTableState={(tableState) => setTableState(WmiTables.Sysinfo, tableState)}
      />
      <Table
        title="Software"
        dataSet={dataSets[WmiTables.Software]}
        tableState={tableStates[WmiTables.Software]}
        setTableState={(tableState) => setTableState(WmiTables.Software, tableState)}
      />
      <Table
        title="BIOS"
        dataSet={dataSets[WmiTables.Bios]}
        tableState={tableStates[WmiTables.Bios]}
        setTableState={(tableState) => setTableState(WmiTables.Bios, tableState)}
      />
    </TabLayout>
  );
}
