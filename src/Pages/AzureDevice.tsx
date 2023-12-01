import {
  getMultipleAzureDevices,
  getSingleAzureDevice,
  getSingleAzureDeviceId,
} from "../Api/azureDevice";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";

export default function AzureDevice() {
  const page = "azureDevice";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);

  const runSearchQuery = async (query: Query) => {
    const searchString = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult("attributes", undefined);

    const { devices } = await getMultipleAzureDevices(searchString);

    updateTab({ icon: "search" });
    setResult("search", devices);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    const displayName = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: displayName || "Azure Device" });
    if (resetSearch) setResult("search", undefined);
    setResult("attributes", null);

    // We need to test if we should run a pre-query or not by checking if the object exists.
    const objectId = await getSingleAzureDeviceId(displayName);
    if (!objectId) return runSearchQuery(query);

    const { attributes } = await getSingleAzureDevice(objectId);

    updateTab({ icon: "computer" });
    setResult("attributes", attributes);
  };

  onRedirect(() => runQuery(query));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
        onRedirect={(row, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.DisplayName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
    </TabLayout>
  );
}
