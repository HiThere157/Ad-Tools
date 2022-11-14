import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

import { columns } from "../Config/default";
import {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
} from "../Helper/makeAPICall";
import { redirect } from "../Helper/redirects";

import InputBar from "../Components/InputBar";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function ComputerPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

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
    await makeAPICall(
      "Get-ADComputer",
      {
        Identity: query.input,
        Server: query.domain,
        Properties: "*",
      },
      [getPropertiesWrapper, getMembershipFromAdUser],
      [setAttributes, setMemberOf]
    );
    setIsLoading(false);
  };

  return (
    <article>
      <InputBar
        label="Computer ID:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Computer Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.small}
          data={memberOf}
          onRedirect={(entry: { Name: string }) => {
            redirect("group", entry.Name, query.domain)
          }}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
