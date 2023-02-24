import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { prepareDNSResult } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import Button from "../Components/Button";
import DnsInputBar from "../Components/InputBars/InputDns";
import Title from "../Components/Title";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsDisplay } from "react-icons/bs";

export default function DnsPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<DnsQuery>(`${p}_query`, {});

  const [results, setResults, resultsKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_results`,
    {},
  );

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall<PSResult[]>({
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
        <Title text="Show Computer Page" position="bottom">
          <Button
            classList="p-1"
            onClick={() => {
              redirect("computer", { input: query.input });
            }}
          >
            <BsDisplay />
          </Button>
        </Title>
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
