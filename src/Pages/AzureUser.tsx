import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

import { columns } from "../Config/default";
import {
  makeAPICall,
  getPropertiesWrapper,
  getExtensionsFromAadUser,
  makeToList,
} from "../Helper/makeAPICall";
import authenticateAzure from "../Helper/azureAuth";

import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function AzureUserPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_a`, {});
  const [ext, setExt, extKey] = useSessionStorage(`${p}_e`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage(`${p}_mo`, {});

  const [reQuery, setReQuery] = useSessionStorage(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);
    await authenticateAzure(query.tenant);
    await makeAPICall({
      command: "Get-AzureADUser",
      args: {
        ObjectId: query.input,
      },
      postProcessor: [getPropertiesWrapper, getExtensionsFromAadUser],
      callback: [setAttributes, setExt],
      useStaticSession: true
    });
    await makeAPICall({
      command: "Get-AzureADUserMembership",
      args: {
        ObjectId: query.input,
        All: "1"
      },
      postProcessor: makeToList,
      callback: setMemberOf,
      useStaticSession: true
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AadInputBar
        label="User ID:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="User Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
        <Table
          title="User Extensions"
          name={extKey}
          columns={columns.attribute}
          data={ext}
          isLoading={isLoading}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.azureGroup}
          data={memberOf}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
