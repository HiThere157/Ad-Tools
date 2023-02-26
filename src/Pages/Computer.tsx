import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getMembershipFromAdObject,
  prepareDNSResult,
  makeToList,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import Button from "../Components/Button";
import AdInputBar from "../Components/InputBars/InputAd";
import Title from "../Components/Title";
import ComputerActions from "../Components/ComputerActions";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsCpu, BsExclamationCircle } from "react-icons/bs";
import { VscAzure } from "react-icons/vsc";

export default function ComputerPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [dns, setDNS, dnsKey] = useSessionStorage<Result<PSResult[]>>(`${p}_dns`, {});
  const [attribs, setAttributes, attribsKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_attribs`,
    {},
  );
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_memberOf`,
    {},
  );

  const [memberOfFallback, setMemberOfFallback] = useSessionStorage<Result<PSResult[]>>(
    `${p}_memberOfFallback`,
    {},
  );

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    await Promise.all([
      makeAPICall<PSResult[]>({
        command: "Resolve-DnsName",
        args: {
          Name: `${query.input}.${query.domain}`,
        },
        postProcessor: prepareDNSResult,
        callback: setDNS,
      }),
      makeAPICall<PSResult[]>({
        command: "Get-ADComputer",
        args: {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        postProcessor: [getPropertiesWrapper, getMembershipFromAdObject],
        callback: [setAttributes, setMemberOfFallback],
      }),
      makeAPICall<PSResult[]>({
        command: "Get-ADPrincipalGroupMembership",
        args: {
          Identity: query.input,
          Server: query.domain,
        },
        postProcessor: makeToList,
        callback: setMemberOf,
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
          <Title text="Show WMI Page" position="bottom">
            <Button className="p-1" onClick={() => redirect("wmi", query)}>
              <BsCpu />
            </Button>
          </Title>
          <Title text="Show Azure Device Page" position="bottom">
            <Button
              className="p-1"
              onClick={() => {
                redirect("azureDevice", { input: query.input });
              }}
            >
              <VscAzure />
            </Button>
          </Title>
        </AdInputBar>
        <ComputerActions fqdn={`${query.input}.${query.domain}`} />
      </div>
      <TableLayout>
        <Table title="DNS" name={dnsKey} columns={columns.dns} data={dns} isLoading={isLoading} />
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
          columns={memberOf.error ? columns.limited : columns.group}
          data={memberOf.error ? memberOfFallback : memberOf}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        >
          {memberOf.error && (
            <Title
              text={`Get-ADPrincipalGroupMembership returned an Error.
            Falling back to MemberOf Property`}
              position="top"
            >
              <BsExclamationCircle className="text-xl text-orangeColor" />
            </Title>
          )}
        </Table>
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
