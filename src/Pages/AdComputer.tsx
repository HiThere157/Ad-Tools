import { AdComputerTables, Pages } from "../Config/const";
import { searchAdComputers, getAdComputer } from "../Api/adComputer";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";

export default function AdComputer() {
  const page = Pages.AdComputer;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const { filters, servers } = query;

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AdComputerTables.Search, null);
    setDataSet(
      [AdComputerTables.Dns, AdComputerTables.Attributes, AdComputerTables.Memberof],
      undefined,
    );

    const { search } = searchAdComputers(filters, servers, columns[AdComputerTables.Search]);

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
      columns[AdComputerTables.Dns],
      columns[AdComputerTables.Memberof],
    );

    setDataSet(AdComputerTables.Dns, dns);
    setDataSet(AdComputerTables.Attributes, attributes);
    setDataSet(AdComputerTables.Memberof, memberof);
    Promise.all([dns, attributes, memberof]).then(() => updateTab({ icon: "computer" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AdQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Computer Search Results"
        page={page}
        tabId={tabId}
        name={AdComputerTables.Search}
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
      <Table title="DNS" page={page} tabId={tabId} name={AdComputerTables.Dns} />
      <Table title="Attributes" page={page} tabId={tabId} name={AdComputerTables.Attributes} />
      <Table
        title="Group Memberships"
        page={page}
        tabId={tabId}
        name={AdComputerTables.Memberof}
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
