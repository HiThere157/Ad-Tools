import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeToList } from "../Helper/postProcessors";
import { makeAPICall } from "../Helper/makeAPICall";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";
import Button from "../Components/Button";
import Title from "../Components/Title";

import { BsSearch } from "react-icons/bs";

export default function ReplicationPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [replication, setReplication, replicationKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_replication`,
    {},
  );

  const runQuery = async () => {
    setIsLoading(true);

    setReplication({ output: [] });

    const [object, dc] = await Promise.all([
      makeAPICall<PSResult[]>({
        command: "Get-ADObject",
        args: {
          Filter: `Name -eq "${query.input}"`,
          Server: query.domain,
        },
        postProcessor: makeToList,
      }),
      makeAPICall<PSResult[]>({
        command: "Get-ADDomainController",
        args: {
          DomainName: query.domain,
          Discover: "",
        },
        postProcessor: makeToList,
      }),
    ]);

    if (object.error || dc.error) {
      setReplication({ output: [], error: object.error ?? dc.error });
      setIsLoading(false);
      return;
    }

    const objectId = (await object.output?.[0])?.[0]?.ObjectGUID;
    const dcName = (await dc.output?.[0])?.[0]?.Name;

    if (!objectId) {
      setReplication({
        output: [],
        error: `No Object found with Name "${query.input}"`,
      });
      setIsLoading(false);
      return;
    }

    await makeAPICall<PSResult[]>({
      command: "Get-ADReplicationAttributeMetadata",
      args: {
        Object: objectId.toString(),
        Server: `${dcName}.${query.domain}`,
      },
      postProcessor: makeToList,
      callback: setReplication,
    });

    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Name:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Title text="Show Search Page" position="bottom">
          <Button className="p-1" onClick={() => redirect("search", query)}>
            <BsSearch />
          </Button>
        </Title>
      </AdInputBar>
      <TableLayout>
        <Table
          title="Replication Attributes"
          name={replicationKey}
          columns={columns.replication}
          data={replication}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
