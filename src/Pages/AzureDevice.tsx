import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

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

export default function AzureDevicePage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_attribs`, {});

  const [reQuery, setReQuery] = useSessionStorage(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    setAttributes({ output: [] });

    await authenticateAzure(query.tenant);
    const devices = await makeAPICall({
      command: "Get-AzureADDevice",
      args: {
        SearchString: query.input,
      },
      postProcessor: makeToList,
      useStaticSession: true
    });

    const output = devices.output as Promise<{ DisplayName: string | undefined, ObjectId: string | undefined }[]>[];
    const firstResult = (await output?.[0])?.[0];

    if (firstResult?.DisplayName === query.input) {
      await makeAPICall({
        command: "Get-AzureADDevice",
        args: {
          ObjectId: firstResult.ObjectId
        },
        postProcessor: getPropertiesWrapper,
        callback: setAttributes,
        useStaticSession: true
      })
      setIsLoading(false);
      return;
    }

    setAttributes({ output: [], error: `No Device found with Identifier "${query.input}"` })
    setIsLoading(false);
  };

  return (
    <article>
      <AadInputBar
        label="Device ID:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Device Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
