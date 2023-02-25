import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { isAuthenticated } from "../Helper/azureAuth";
import { makeAPICall } from "../Helper/makeAPICall";
import { makeToList } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AzureLogin from "../Components/Popups/AzureLogin";
import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function AzureSearchPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AadQuery>(`${p}_query`, {});

  const [users, setUsers, usersKey] = useSessionStorage<Result<PSResult[]>>(`${p}_users`, {});
  const [groups, setGroups, groupsKey] = useSessionStorage<Result<PSResult[]>>(`${p}_groups`, {});
  const [devices, setDevices, devicesKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_devices`,
    {},
  );

  const [loginPopup, setLoginPopup] = useState<boolean>(false);
  const checkLogin = async () => {
    if (await isAuthenticated()) return runQuery();
    setLoginPopup(true);
  };

  const runQuery = async () => {
    setIsLoading(true);

    setUsers({ output: [] });
    setGroups({ output: [] });
    setDevices({ output: [] });

    await makeAPICall<PSResult[]>({
      command: "Get-AzureADUser",
      args: {
        SearchString: query.input,
        All: "1",
      },
      selectFields: columns.azureUser,
      postProcessor: makeToList,
      callback: setUsers,
      useStaticSession: true,
    });
    await makeAPICall<PSResult[]>({
      command: "Get-AzureADGroup",
      args: {
        SearchString: query.input,
        All: "1",
      },
      selectFields: columns.azureGroup,
      postProcessor: makeToList,
      callback: setGroups,
      useStaticSession: true,
    });
    await makeAPICall<PSResult[]>({
      command: "Get-AzureADDevice",
      args: {
        SearchString: query.input,
        All: "1",
      },
      selectFields: columns.azureDevice,
      postProcessor: makeToList,
      callback: setDevices,
      useStaticSession: true,
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AzureLogin
        isOpen={loginPopup}
        onExit={() => {
          setLoginPopup(false);
          runQuery();
        }}
      />
      <AadInputBar
        label="Azure Query:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={checkLogin}
      />
      <TableLayout>
        <Table
          title="Users"
          name={usersKey}
          columns={columns.azureUser}
          data={users}
          onRedirect={(entry: { UserPrincipalName?: string }) => {
            redirect("azureUser", {
              input: entry.UserPrincipalName,
            });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Groups"
          name={groupsKey}
          columns={columns.azureGroup}
          data={groups}
          onRedirect={(entry: { DisplayName?: string }) => {
            redirect("azureGroup", {
              input: entry.DisplayName,
            });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Devices"
          name={devicesKey}
          columns={columns.azureDevice}
          data={devices}
          onRedirect={(entry: { DisplayName?: string }) => {
            redirect("azureDevice", {
              input: entry.DisplayName,
            });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
