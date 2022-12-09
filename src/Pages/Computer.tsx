import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getMembershipFromAdUser,
  prepareDNSResult,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import ComputerActions from "../Components/ComputerActions";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsCpu } from "react-icons/bs";
import { VscAzure } from "react-icons/vsc";

export default function ComputerPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [dns, setDNS, dnsKey] = useSessionStorage(`${p}_dns`, {});
  const [attribs, setAttributes, attribsKey] = useSessionStorage(
    `${p}_attribs`,
    {},
  );
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage(
    `${p}_memberOf`,
    {},
  );

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
          Name: `${query.input}.${query.domain}`,
        },
        postProcessor: prepareDNSResult,
        callback: setDNS,
      }),
      makeAPICall({
        command: "Get-ADComputer",
        args: {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        postProcessor: [getPropertiesWrapper, getMembershipFromAdUser],
        callback: [setAttributes, setMemberOf],
      }),
    ]);

    setIsLoading(false);
  };

  return (
    <article>
      <div className="w-fit">
        <AdInputBar
          label="Computer:"
          isLoading={isLoading}
          query={query}
          onChange={setQuery}
          onSubmit={runQuery}
        >
          <Button classOverride="p-1" onClick={() => redirect("wmi", query)}>
            <BsCpu />
          </Button>
          <Button
            classOverride="p-1"
            onClick={() => {
              redirect("azureDevice", { input: query.input });
            }}
          >
            <VscAzure />
          </Button>
        </AdInputBar>
        <ComputerActions fqdn={`${query.input}.${query.domain}`} />
      </div>
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
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
