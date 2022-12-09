import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { prepareDNSResult } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import DnsInputBar from "../Components/InputBars/InputDns";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsWindows } from "react-icons/bs";

export default function DnsPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [results, setResults, resultsKey] = useSessionStorage(
    `${p}_results`,
    {},
  );

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall({
      command: "Resolve-DnsName",
      args: {
        Name: query.input,
        Type: query.type,
      },
      postProcessor: prepareDNSResult,
      callback: setResults,
    });
    setIsLoading(false);
  };

  return (
    <article>
      <DnsInputBar
        label="Query:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Button
          classOverride="p-1"
          onClick={() => {
            redirect("computer", { input: query.input });
          }}
        >
          <BsWindows />
        </Button>
      </DnsInputBar>
      <TableLayout>
        <Table
          title="Results"
          name={resultsKey}
          columns={columns.dns}
          data={results}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
