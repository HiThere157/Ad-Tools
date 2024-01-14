import { Pages, WmiTables } from "../Config/const";
import { searchAdComputers } from "../Api/adComputer";
import { getWmiInfo } from "../Api/wmi";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function Printers() {
  const page = Pages.Wmi;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(WmiTables.Search, null);
    setDataSet(
      [WmiTables.Monitors, WmiTables.Sysinfo, WmiTables.Software, WmiTables.Bios],
      undefined,
    );

    const { search } = searchAdComputers(filters, servers, columns[WmiTables.Search]);

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
      columns[WmiTables.Monitors],
      columns[WmiTables.Software],
      columns[WmiTables.Bios],
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
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Computer Search Results"
        page={page}
        tabId={tabId}
        name={WmiTables.Search}
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
      <Table title="Monitors" page={page} tabId={tabId} name={WmiTables.Monitors} />
      <Table title="Sysinfo" page={page} tabId={tabId} name={WmiTables.Sysinfo} />
      <Table title="Software" page={page} tabId={tabId} name={WmiTables.Software} />
      <Table title="BIOS" page={page} tabId={tabId} name={WmiTables.Bios} />
    </TabLayout>
  );
}
