import { getMultipleAdComputers } from "../Api/adComputer";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import { getSingleWmiInfo } from "../Api/wmi";

export default function Printers() {
  const page = "wmi";
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet("search", null);
    setDataSet(["monitors", "sysinfo", "software", "bios"], undefined);

    const { computers } = getMultipleAdComputers(filters, servers);

    setDataSet("search", computers);
    computers.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "WMI" });
    if (resetSearch) setDataSet("search", undefined);
    setDataSet(["monitors", "sysinfo", "software", "bios"], null);

    const { monitors, sysinfo, software, bios } = getSingleWmiInfo(identity, server);

    setDataSet("monitors", monitors);
    setDataSet("sysinfo", sysinfo);
    setDataSet("software", software);
    setDataSet("bios", bios);
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
        name="search"
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
      <Table title="Monitors" page={page} tabId={tabId} name="monitors" />
      <Table title="Sysinfo" page={page} tabId={tabId} name="sysinfo" />
      <Table title="Software" page={page} tabId={tabId} name="software" />
      <Table title="BIOS" page={page} tabId={tabId} name="bios" />
    </TabLayout>
  );
}
