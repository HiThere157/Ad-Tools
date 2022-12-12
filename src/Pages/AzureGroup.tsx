import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { getPropertiesWrapper, makeToList } from "../Helper/postProcessors";
import authenticateAzure from "../Helper/azureAuth";
import { redirect } from "../Helper/redirects";

import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsWindows } from "react-icons/bs";

export default function AzureGroupPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AadQuery>(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage<ResultData>(`${p}_attribs`, {});
  const [members, setMembers, membersKey] = useSessionStorage<ResultData>(`${p}_members`, {});

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    setAttributes({ output: [] });
    setMembers({ output: [] });

    await authenticateAzure(query.tenant);
    const groups = await makeAPICall({
      command: "Get-AzureADGroup",
      args: {
        SearchString: query.input,
      },
      postProcessor: makeToList,
      useStaticSession: true,
    });

    if (groups.error) {
      setAttributes({ output: [], error: groups.error });
      setMembers({ output: [], error: groups.error });
      setIsLoading(false);
      return;
    }

    const output = groups.output as Promise<
      { DisplayName: string | undefined; ObjectId: string | undefined }[]
    >[];
    const firstResult = (await output?.[0])?.[0];

    if (firstResult?.DisplayName === query.input) {
      await makeAPICall({
        command: "Get-AzureADGroup",
        args: {
          ObjectId: firstResult.ObjectId,
        },
        postProcessor: getPropertiesWrapper,
        callback: setAttributes,
        useStaticSession: true,
      });
      await makeAPICall({
        command: "Get-AzureADGroupMember",
        args: {
          ObjectId: firstResult.ObjectId,
          All: "1",
        },
        selectFields: columns.azureUser.map((column) => column.key),
        postProcessor: makeToList,
        callback: setMembers,
        useStaticSession: true,
      });
      setIsLoading(false);
      return;
    }

    setAttributes({
      output: [],
      error: `No Group found with Identifier "${query.input}"`,
    });
    setMembers({
      output: [],
      error: `No Group found with Identifier "${query.input}"`,
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AadInputBar
        label="Azure Group:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Button
          classOverride="p-1"
          onClick={() => {
            redirect("group", { input: query.input });
          }}
        >
          <BsWindows />
        </Button>
      </AadInputBar>
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
          columns={columns.azureUser}
          data={members}
          onRedirect={(entry: { UserPrincipalName?: string }) => {
            redirect("azureUser", {
              input: entry.UserPrincipalName,
              tenant: query.tenant,
            });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
