import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getMembershipFromAdUser,
  makeToList,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { VscAzure } from "react-icons/vsc";

export default function GroupPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage<ResultData>(`${p}_attribs`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage<ResultData>(`${p}_memberOf`, {});
  const [members, setMembers, membersKey] = useSessionStorage<ResultData>(`${p}_members`, {});

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);
    await Promise.all([
      makeAPICall({
        command: "Get-ADGroup",
        args: {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        postProcessor: [getPropertiesWrapper, getMembershipFromAdUser],
        callback: [setAttributes, setMemberOf],
      }),
      makeAPICall({
        command: "Get-ADGroupMember",
        args: {
          Identity: query.input,
          Server: query.domain,
        },
        postProcessor: makeToList,
        callback: setMembers,
      }),
    ]);
    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Group:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Button
          classOverride="p-1"
          onClick={() => {
            redirect("azureGroup", { input: query.input });
          }}
        >
          <VscAzure />
        </Button>
      </AdInputBar>
      <TableLayout>
        <Table
          title="Group Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
        <Table
          title="Members"
          name={membersKey}
          columns={columns.extended}
          data={members}
          onRedirect={(entry: { Name?: string; ObjectClass?: string }) => {
            if (!entry.ObjectClass) return;
            if (!["group", "user", "computer"].includes(entry.ObjectClass)) return;
            redirect(entry.ObjectClass, {
              input: entry.Name,
              domain: query.domain,
            });
            if (entry.ObjectClass === "group") window.location.reload();
          }}
          isLoading={isLoading}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.default}
          data={memberOf}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
            window.location.reload();
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
