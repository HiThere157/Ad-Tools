import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import makeAPICall from "../Helper/makeAPICall";
import {
  makeToList,
} from "../Helper/postProcessors";
import authenticateAzure from "../Helper/azureAuth";
import { redirect } from "../Helper/redirects";

import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function AzureSearchPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [users, setUsers, usersKey] = useSessionStorage(`${p}_u`, {});
  const [groups, setGroups, groupsKey] = useSessionStorage(`${p}_g`, {});
  const [devices, setDevices, devicesKey] = useSessionStorage(`${p}_d`, {});

  const runQuery = async () => {
    setIsLoading(true);

    setUsers({ output: [] });
    setGroups({ output: [] });
    setDevices({ output: [] });

    await authenticateAzure(query.tenant);
    await makeAPICall({
      command: "Get-AzureADUser",
      args: {
        SearchString: query.input,
        All: "1"
      },
      selectFields: columns.azureUser.map(column => column.key),
      postProcessor: makeToList,
      callback: setUsers,
      useStaticSession: true
    });
    await makeAPICall({
      command: "Get-AzureADGroup",
      args: {
        SearchString: query.input,
        All: "1"
      },
      selectFields: columns.azureGroup.map(column => column.key),
      postProcessor: makeToList,
      callback: setGroups,
      useStaticSession: true
    });
    await makeAPICall({
      command: "Get-AzureADDevice",
      args: {
        SearchString: query.input,
        All: "1"
      },
      selectFields: columns.azureDevice.map(column => column.key),
      postProcessor: makeToList,
      callback: setDevices,
      useStaticSession: true
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AadInputBar
        label="Search String:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Users"
          name={usersKey}
          columns={columns.azureUser}
          data={users}
          onRedirect={(entry: { UserPrincipalName: string }) => {
            redirect("azureUser", { input: entry.UserPrincipalName, tenant: query.tenant })
          }}
          isLoading={isLoading}
        />
        <Table
          title="Groups"
          name={groupsKey}
          columns={columns.azureGroup}
          data={groups}
          onRedirect={(entry: { DisplayName: string }) => {
            redirect("azureGroup", { input: entry.DisplayName, tenant: query.tenant })
          }}
          isLoading={isLoading}
        />
        <Table
          title="Devices"
          name={devicesKey}
          columns={columns.azureDevice}
          data={devices}
          onRedirect={(entry: { DisplayName: string }) => {
            redirect("azureDevice", { input: entry.DisplayName, tenant: query.tenant })
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
