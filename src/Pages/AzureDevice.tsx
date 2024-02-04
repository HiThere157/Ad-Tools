import { AzureDeviceTables, Pages } from "../Config/const";
import { searchAzureDevices, getAzureDevice, getAzureDeviceId } from "../Api/azureDevice";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";
import MissingModules from "../Components/Popup/MissingModules";

export default function AzureDevice() {
  const page = Pages.AzureDevice;
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
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AzureDeviceTables.Search, null);
    setDataSet(AzureDeviceTables.Attributes, undefined);

    const { search } = searchAzureDevices(searchString, tableColumns[AzureDeviceTables.Search]);

    setDataSet(AzureDeviceTables.Search, search);
    search.then(() => updateTab({ icon: "search" }));
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const displayName = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: displayName || "Azure Device" });
    if (resetSearch) setDataSet(AzureDeviceTables.Search, undefined);
    setDataSet(AzureDeviceTables.Attributes, null);

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const objectId = await getAzureDeviceId(displayName);
    if (!objectId) return runSearchQuery(query);

    const { attributes } = getAzureDevice(objectId);

    setDataSet(AzureDeviceTables.Attributes, attributes);
    attributes.then(() => updateTab({ icon: "computer" }));
  };

  useOnRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <MissingModules type="azureAd" />
      <AzureQuery
        query={query}
        isLocked={isLocked}
        setQuery={setQuery}
        onSubmit={() => runQuery(query, true)}
      />

      <Table
        title="Device Search Results"
        dataSet={dataSets[AzureDeviceTables.Search]}
        tableState={tableStates[AzureDeviceTables.Search]}
        setTableState={(state) => setTableState(AzureDeviceTables.Search, state)}
        isSearchTable={true}
        redirectColumn="DisplayName"
        onRedirect={({ DisplayName }, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: DisplayName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table
        title="Attributes"
        dataSet={dataSets[AzureDeviceTables.Attributes]}
        tableState={tableStates[AzureDeviceTables.Attributes]}
        setTableState={(state) => setTableState(AzureDeviceTables.Attributes, state)}
      />
    </TabLayout>
  );
}
