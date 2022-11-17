import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

import { columns } from "../Config/default";
import {
  makeAPICall,
  makeToList
} from "../Helper/makeAPICall";
import { redirect } from "../Helper/redirects";

import InputBar from "../Components/InputBar";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function SearchPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [results, setResults, resultsKey] = useSessionStorage(`${p}_r`, {});

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall(
      "Get-ADObject",
      {
        Filter: `Name -like "${query.input}"`,
        Server: query.domain,
      },
      makeToList,
      setResults
    );
    setIsLoading(false);
  };

  return (
    <article>
      <InputBar
        label="Search:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Results"
          name={resultsKey}
          columns={columns.extended}
          data={results}
          onRedirect={(entry: { Name: string, ObjectClass: string }) => {
            if (!["group", "user", "computer"].includes(entry.ObjectClass)) return;
            redirect(entry.ObjectClass, entry.Name, query.domain)
          }}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
