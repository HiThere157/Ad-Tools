import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { AdQuery, ResultData } from "../Types/api";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { makeToList } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function SearchPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [users, setUsers, usersKey] = useSessionStorage<ResultData>(
    `${p}_users`,
    {},
  );
  const [groups, setGroups, groupsKey] = useSessionStorage<ResultData>(
    `${p}_groups`,
    {},
  );
  const [computers, setComputers, computersKey] = useSessionStorage<ResultData>(
    `${p}_computers`,
    {},
  );

  const runQuery = async () => {
    setIsLoading(true);
    await Promise.all([
      makeAPICall({
        command: "Get-ADUser",
        args: {
          Filter: `Name -like "${query.input}"`,
          Server: query.domain,
        },
        postProcessor: makeToList,
        callback: setUsers,
      }),
      makeAPICall({
        command: "Get-ADGroup",
        args: {
          Filter: `Name -like "${query.input}"`,
          Server: query.domain,
        },
        postProcessor: makeToList,
        callback: setGroups,
      }),
      makeAPICall({
        command: "Get-ADComputer",
        args: {
          Filter: `Name -like "${query.input}"`,
          Server: query.domain,
        },
        postProcessor: makeToList,
        callback: setComputers,
      }),
    ]);
    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Query:"
        hint="Hint: wildcard (*) is possible. (Eg.: *kochda7 => kochda7, adm_kochda7)"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Users"
          name={usersKey}
          columns={columns.default}
          data={users}
          onRedirect={(entry: { Name?: string }) => {
            redirect("user", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Groups"
          name={groupsKey}
          columns={columns.default}
          data={groups}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Computers"
          name={computersKey}
          columns={columns.default}
          data={computers}
          onRedirect={(entry: { Name?: string }) => {
            redirect("computer", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
