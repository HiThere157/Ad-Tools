import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { makeToList } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import Checkbox from "../Components/Checkbox";
import AdvancedFilters from "../Components/InputBars/AdvancedFilters";
import Hint from "../Components/InputBars/Hint";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

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

  const getFilterString = () => {
    if (!isAdvanced) return `Name -like "${query.input}"`;

    return Object.entries(searchFilter)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key} -${value.includes("*") ? "like" : "eq"} "${value}"`)
      .join(" -and ");
  };

  const getAllColumns = (existing: string[], isTable: boolean = false) => {
    const properties = [...existing, ...Object.keys(searchFilter)];

    if (isTable && query.domain?.includes(",")) return ["__domain__", ...properties];
    return properties;
  };

  useEffect(() => {
    if (isAdvanced) setQuery({ input: "", domain: query.domain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdvanced]);

  const aggregateResults = (
    currentResult: Result<PSResult[]>,
    newResult: Result<PSResult[]>,
    domain: string,
  ): Result<PSResult[]> => {
    if (newResult.error || currentResult.error) {
      return { error: `${currentResult.error}; ${newResult.error}`, output: [] };
    }

    const newOutput = (newResult.output ?? []).map((result) => {
      return { __domain__: domain, ...result };
    });

    return { output: [...(currentResult.output ?? []), ...newOutput] };
  };

  const runQuery = async () => {
    setIsLoading(true);

    let resultsUsers: Result<PSResult[]> = { output: [] };
    let resultsGroups: Result<PSResult[]> = { output: [] };
    let resultsComputers: Result<PSResult[]> = { output: [] };

    setUsers(resultsUsers);
    setGroups(resultsGroups);
    setComputers(resultsComputers);

    // InputAd returns domains separated with , when multiDomain is enabled
    const queries = query.domain?.split(",").map((domain) => {
      return [
        makeAPICall<PSResult[]>({
          command: "Get-ADUser",
          args: {
            Filter: getFilterString(),
            Server: domain,
            Properties: getAllColumns(columns.user).join(","),
          },
          postProcessor: makeToList,
          callback: (result: Result<PSResult[]>) => {
            resultsUsers = aggregateResults(resultsUsers, result, domain);
          },
        }),
        makeAPICall<PSResult[]>({
          command: "Get-ADGroup",
          args: {
            Filter: getFilterString(),
            Server: domain,
            Properties: getAllColumns(columns.group).join(","),
          },
          postProcessor: makeToList,
          callback: (result: Result<PSResult[]>) => {
            resultsGroups = aggregateResults(resultsGroups, result, domain);
          },
        }),
        makeAPICall<PSResult[]>({
          command: "Get-ADComputer",
          args: {
            Filter: getFilterString(),
            Server: domain,
            Properties: getAllColumns(columns.computer).join(","),
          },
          postProcessor: makeToList,
          callback: (result: Result<PSResult[]>) => {
            resultsComputers = aggregateResults(resultsComputers, result, domain);
          },
        }),
      ];
    });

    await Promise.all(queries?.flat() || []);

    setUsers(resultsUsers);
    setGroups(resultsGroups);
    setComputers(resultsComputers);

    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Query:"
        isLoading={isLoading}
        isBlocked={isAdvanced}
        query={query}
        multiDomain={true}
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

      {isAdvanced && <Hint hint="Hint: Leave the Filter empty to add Columns to the Output" />}
      <Hint
        hint="Hint: wildcard (*) is possible. (Eg.: *kochda7 => kochda7, adm_kochda7)"
        className="mb-3"
      />

      <TableLayout>
        <Table
          title="Users"
          name={usersKey}
          columns={getAllColumns(columns.user, true)}
          data={users}
          onRedirect={(entry: { Name?: string; __domain__?: string }) => {
            redirect("user", { input: entry.Name, domain: entry.__domain__ });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Groups"
          name={groupsKey}
          columns={getAllColumns(columns.group, true)}
          data={groups}
          onRedirect={(entry: { Name?: string; __domain__?: string }) => {
            redirect("group", { input: entry.Name, domain: entry.__domain__ });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Computers"
          name={computersKey}
          columns={getAllColumns(columns.computer, true)}
          data={computers}
          onRedirect={(entry: { Name?: string; __domain__?: string }) => {
            redirect("computer", { input: entry.Name, domain: entry.__domain__ });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
