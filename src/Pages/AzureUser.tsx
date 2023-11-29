import { useState } from "react";
import { useSelector } from "react-redux";

import {
  getMultipleAzureUsers,
  getSingleAzureInfoUser,
  getSingleAzureUser,
} from "../Api/azureUser";
import { useRedirect } from "../Hooks/useRedirect";
import { useTabState } from "../Hooks/useTabState";
import { RootState } from "../Redux/store";
import { getFilterValue } from "../Helper/utils";

import TabLayout from "../Layout/TabLayout";
import AzureQuery from "../Components/Query/AzureQuery";
import Table from "../Components/Table/Table";
import AzureLogin from "../Components/Popup/AzureLogin";

export default function AzureUser() {
  const page = "azureUser";
  const { redirect, onRedirect } = useRedirect();
  const { tabId, query, updateTab, setResult } = useTabState(page);
  const { executingAzureUser } = useSelector((state: RootState) => state.environment);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const runPreQuery = async (query: Query) => {
    updateTab({ icon: "loading", title: "Search Results" });
    setResult("search", null);
    setResult(["attributes", "memberof", "devices"], undefined);

    const { users } = await getMultipleAzureUsers(query);

    updateTab({ icon: "search" });
    setResult("search", users);
  };

  const runQuery = async (query: Query, resetSearch?: boolean) => {
    if (!executingAzureUser) return setIsLoginOpen(true);

    const identity = getFilterValue(query.filters, "Name");

    updateTab({ icon: "loading", title: identity || "Azure User" });
    if (resetSearch) setResult("search", undefined);
    setResult(["attributes", "memberof", "devices"], null);

    const { attributes } = await getSingleAzureUser(query);
    if (attributes?.error) return runPreQuery(query);

    const { memberof, devices } = await getSingleAzureInfoUser(query);

    updateTab({ icon: "user" });
    setResult("attributes", attributes);
    setResult("memberof", memberof);
    setResult("devices", devices);
  };

  onRedirect(() => runQuery(query, true));

  return (
    <TabLayout page={page}>
      <AzureQuery page={page} tabId={tabId} onSubmit={() => runQuery(query, true)} />

      <Table
        title="Search Results"
        page={page}
        tabId={tabId}
        name="search"
        hideIfEmpty={true}
        onRedirect={(row: PSResult & { UserPrincipalName?: string; _Server?: string }, newTab) => {
          const newQuery = {
            filters: [{ property: "Name", value: row.UserPrincipalName ?? "" }],
            servers: [],
          };

          if (newTab) return redirect(page, newQuery);
          runQuery(newQuery);
        }}
      />
      <Table title="Attributes" page={page} tabId={tabId} name="attributes" />
      <Table title="Group Memberships" page={page} tabId={tabId} name="memberof" />
      <Table title="Devices" page={page} tabId={tabId} name="devices" />

      <AzureLogin
        isOpen={isLoginOpen}
        onExit={(status) => {
          setIsLoginOpen(false);
          if (status) runQuery(query, true);
        }}
      />
    </TabLayout>
  );
}
