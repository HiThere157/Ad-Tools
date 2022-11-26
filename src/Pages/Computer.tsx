import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Components/Hooks/useStorage";

import { columns } from "../Config/default";
import makeAPICall from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getMembershipFromAdUser,
  prepareDNSResult
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function ComputerPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [dns, setDNS, dnsKey] = useSessionStorage(`${p}_d`, {});
  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_a`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage(`${p}_mo`, {});

  const [reQuery, setReQuery] = useSessionStorage(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    await Promise.all([
      makeAPICall({
        command: "Resolve-DnsName",
        args: {
          Name: `${query.input}.${query.domain}`
        },
        postProcessor: prepareDNSResult,
        callback: setDNS
      }),
      makeAPICall({
        command: "Get-ADComputer",
        args: {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        postProcessor: [getPropertiesWrapper, getMembershipFromAdUser],
        callback: [setAttributes, setMemberOf]
      })
    ])

    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Computer ID:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="DNS"
          name={dnsKey}
          columns={columns.dns}
          data={dns}
          isLoading={isLoading}
        />
        <Table
          title="Computer Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.default}
          data={memberOf}
          onRedirect={(entry: { Name: string }) => {
            redirect("group", entry.Name, query.domain)
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
