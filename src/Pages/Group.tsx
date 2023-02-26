import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getMembershipFromAdObject,
  makeToList,
  getMembersFromAdGroup,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import RecursiveMembers from "../Components/Popups/RecursiveMembers";
import Button from "../Components/Button";
import AdInputBar from "../Components/InputBars/InputAd";
import Title from "../Components/Title";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsExclamationCircle, BsListNested } from "react-icons/bs";
import { VscAzure } from "react-icons/vsc";

export default function GroupPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});
  const [showRecursiveMembers, setShowRecursiveMembers] = useState<boolean>(false);

  const [attribs, setAttributes, attribsKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_attribs`,
    {},
  );
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_memberOf`,
    {},
  );
  const [members, setMembers, membersKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_members`,
    {},
  );

  const [memberOfFallback, setMemberOfFallback] = useSessionStorage<Result<PSResult[]>>(
    `${p}_memberOfFallback`,
    {},
  );
  const [membersFallback, setMembersFallback] = useSessionStorage<Result<PSResult[]>>(
    `${p}_membersFallback`,
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

    setAttributes({ output: [] });
    setMemberOfFallback({ output: [] });
    setMembersFallback({ output: [] });
    setMemberOf({ output: [] });
    setMembers({ output: [] });

    await Promise.all([
      makeAPICall<PSResult[]>({
        command: "Get-ADGroup",
        args: {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        postProcessor: [getPropertiesWrapper, getMembershipFromAdObject, getMembersFromAdGroup],
        callback: [setAttributes, setMemberOfFallback, setMembersFallback],
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
      makeAPICall<PSResult[]>({
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
      <RecursiveMembers
        query={query}
        isOpen={showRecursiveMembers}
        onExit={() => {
          setShowRecursiveMembers(false);
        }}
      />
      <AdInputBar
        label="Group:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Title text="Show Recursive Members" position="bottom">
          <Button
            className="p-1"
            onClick={() => {
              setShowRecursiveMembers(true);
            }}
          >
            <BsListNested />
          </Button>
        </Title>
        <Title text="Show Azure Group Page" position="bottom">
          <Button
            className="p-1"
            onClick={() => {
              redirect("azureGroup", { input: query.input });
            }}
          >
            <VscAzure />
          </Button>
        </Title>
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
          columns={members.error ? columns.limited : columns.member}
          data={members.error ? membersFallback : members}
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
        >
          {members.error && (
            <Title
              text={`Get-ADGroupMember returned an Error.
            Falling back to Members Property`}
              position="top"
            >
              <BsExclamationCircle className="text-xl text-orangeColor" />
            </Title>
          )}
        </Table>
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={memberOf.error ? columns.limited : columns.group}
          data={memberOf.error ? memberOfFallback : memberOf}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
            window.location.reload();
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
