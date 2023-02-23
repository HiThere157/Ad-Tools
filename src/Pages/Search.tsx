import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage, useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { makeToList } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";
import Checkbox from "../Components/Checkbox";
import AdvancedFilters from "../Components/InputBars/AdvancedFilters";
import Hint from "../Components/InputBars/Hint";

export default function SearchPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdvanced, setIsAdvanced] = useSessionStorage<boolean>(`${p}_queryAdvanced`, false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});
  const [searchFilter, setSearchFilter] = useSessionStorage<Filter>(`${p}_searchFilter`, {});

  const [users, setUsers, usersKey] = useSessionStorage<Result<PSResult[]>>(`${p}_users`, {});
  const [groups, setGroups, groupsKey] = useSessionStorage<Result<PSResult[]>>(`${p}_groups`, {});
  const [computers, setComputers, computersKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_computers`,
    {},
  );
  const [usersCC, setUsersCC] = useLocalStorage<string[]>(`${usersKey}_customColumns`, []);
  const [groupsCC, setGroupsCC] = useLocalStorage<string[]>(`${groupsKey}_customColumns`, []);
  const [computersCC, setComputersCC] = useLocalStorage<string[]>(
    `${computersKey}_customColumns`,
    [],
  );

  const getFilterString = () => {
    if (!isAdvanced) return `Name -like "${query.input}"`;

    return Object.entries(searchFilter)
      .map(([key, value]) => `${key} -like "${value}"`)
      .join(" -and ");
  };

  const runQuery = async () => {
    setIsLoading(true);
    await Promise.all([
      makeAPICall<PSResult[]>({
        command: "Get-ADUser",
        args: {
          Filter: getFilterString(),
          Server: query.domain,
        },
        selectFields: [...columns.user.map((col) => col.key), ...usersCC],
        postProcessor: makeToList,
        callback: setUsers,
      }),
      makeAPICall<PSResult[]>({
        command: "Get-ADGroup",
        args: {
          Filter: getFilterString(),
          Server: query.domain,
        },
        selectFields: [...columns.group.map((col) => col.key), ...groupsCC],
        postProcessor: makeToList,
        callback: setGroups,
      }),
      makeAPICall<PSResult[]>({
        command: "Get-ADComputer",
        args: {
          Filter: getFilterString(),
          Server: query.domain,
        },
        selectFields: [...columns.computer.map((col) => col.key), ...computersCC],
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
        isLoading={isLoading}
        isBlocked={isAdvanced}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Checkbox
          label="Advanced"
          checked={isAdvanced}
          onChange={() => {
            setIsAdvanced(!isAdvanced);
          }}
          disabled={isLoading}
        />
      </AdInputBar>
      {isAdvanced && (
        <AdvancedFilters
          filter={searchFilter}
          onFilterChange={setSearchFilter}
          isLocked={isLoading}
        />
      )}
      <Hint hint="Hint: wildcard (*) is possible. (Eg.: *kochda7 => kochda7, adm_kochda7)" />
      <TableLayout>
        <Table
          title="Users"
          name={usersKey}
          columns={columns.user}
          customColumns={usersCC}
          setCustomColumns={setUsersCC}
          data={users}
          onRedirect={(entry: { Name?: string }) => {
            redirect("user", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Groups"
          name={groupsKey}
          columns={columns.group}
          customColumns={groupsCC}
          setCustomColumns={setGroupsCC}
          data={groups}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Computers"
          name={computersKey}
          columns={columns.computer}
          customColumns={computersCC}
          setCustomColumns={setComputersCC}
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
