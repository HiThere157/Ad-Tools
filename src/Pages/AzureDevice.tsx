import { AzureDeviceTables, Pages } from "../Config/const";
import { searchAzureDevices, getAzureDevice, getAzureDeviceId } from "../Api/azureDevice";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureDevice() {
  const page = Pages.AzureDevice;
  const { redirect, useOnRedirect } = useRedirect();
  const { tabId, query, columns, updateTab, setDataSet } = useTabState(page);

  const runSearchQuery = (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setDataSet(AzureDeviceTables.Search, null);
    setDataSet(AzureDeviceTables.Attributes, undefined);

    const { search } = searchAzureDevices(searchString, columns[AzureDeviceTables.Search]);

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
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Device Search Results"
        page={page}
        tabId={tabId}
        name={AzureDeviceTables.Search}
        isSearchTable={true}
        redirectColumn="DisplayName"
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name={AzureDeviceTables.Attributes} />
    </TabLayout>
  );
}
