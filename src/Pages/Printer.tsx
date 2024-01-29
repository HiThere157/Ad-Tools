import { Pages, PrintersTables } from "../Config/const";
import { searchAdComputers } from "../Api/adComputer";
import { getPrinters } from "../Api/printers";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue, shouldSearchQuery } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AdQuery from "../Components/Query/AdQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function Printers() {
  const page = Pages.Printers;
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
    setDataSet(PrintersTables.Search, null);
    setDataSet(PrintersTables.Printers, undefined);

    const { search } = searchAdComputers(filters, servers, tableColumns[PrintersTables.Search]);

    setDataSet(PrintersTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = (query: Query, resetSearch?: boolean) => {
    // We can predict if we need to run a pre-query based on the query itself.
    if (shouldSearchQuery(query)) return runSearchQuery(query);

    const identity = getFilterValue(query.filters, "Name");
    const server = query.servers[0];

    updateTab({ icon: "loading", title: identity || "Printers" });
    if (resetSearch) setDataSet(PrintersTables.Search, undefined);
    setDataSet(PrintersTables.Printers, null);

    const { printers } = getPrinters(identity, server, tableColumns[PrintersTables.Printers]);

    setDataSet(PrintersTables.Printers, printers);
    printers.then(() => updateTab({ icon: "printer" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="ad" />
      <AdQuery query={query} setQuery={setQuery} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Computer Search Results"
        dataSet={dataSets[PrintersTables.Search]}
        tableState={tableStates[PrintersTables.Search]}
        setTableState={(state) => setTableState(PrintersTables.Search, state)}
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
        title="Printers"
        dataSet={dataSets[PrintersTables.Printers]}
        tableState={tableStates[PrintersTables.Printers]}
        setTableState={(state) => setTableState(PrintersTables.Printers, state)}
      />
    </TabLayout>
  );
}
