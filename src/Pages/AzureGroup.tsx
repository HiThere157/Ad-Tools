import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Components/Hooks/useStorage";

import { columns } from "../Config/default";
import makeAPICall from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  makeToList,
} from "../Helper/postProcessors";
import authenticateAzure from "../Helper/azureAuth";

import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function AzureGroupPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_a`, {});
  const [members, setMembers, membersKey] = useSessionStorage(`${p}_m`, {});

  const [reQuery, setReQuery] = useSessionStorage(`${p}_reQuery`, false);
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
      useStaticSession: true
    });

    const output = groups.output as Promise<{ DisplayName: string | undefined, ObjectId: string | undefined }[]>[]
    const firstResult = (await output[0])[0]

    if (firstResult.DisplayName === query.input) {
      await makeAPICall({
        command: "Get-AzureADGroup",
        args: {
          ObjectId: firstResult.ObjectId
        },
        postProcessor: getPropertiesWrapper,
        callback: setAttributes,
        useStaticSession: true
      })
      await makeAPICall({
        command: "Get-AzureADGroupMember",
        args: {
          ObjectId: firstResult.ObjectId,
          All: "1"
        },
        postProcessor: makeToList,
        callback: setMembers,
        useStaticSession: true
      })
    } else {
      setAttributes({ output: [], error: `No Group found with Identifier "${query.input}"` })
      setMembers({ output: [], error: `No Group found with Identifier "${query.input}"` })
    }

    setIsLoading(false);
  };

  return (
    <article>
      <AadInputBar
        label="Group ID:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
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
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
