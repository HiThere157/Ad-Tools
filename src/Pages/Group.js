import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

import {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
  makeToList,
} from "../Helper/makeAPICall";

import InputBar from "../Components/InputBar";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { columns } from "../Config/default";

export default function GroupPage() {
  const p = useLocation().pathname.substring(1);

  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_a`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage(`${p}_mo`, {});
  const [members, setMembers, membersKey] = useSessionStorage(`${p}_m`, {});

  const [reQuery, setReQuery] = useSessionStorage(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);
    await Promise.all([
      makeAPICall(
        "Get-ADGroup",
        {
          Identity: query.input,
          Server: query.domain,
          Properties: "*",
        },
        [getPropertiesWrapper, getMembershipFromAdUser],
        [setAttributes, setMemberOf]
      ),
      makeAPICall(
        "Get-ADGroupMember",
        { Identity: query.input, Server: query.domain },
        makeToList,
        setMembers
      ),
    ]);
    setIsLoading(false);
  };

  return (
    <article>
      <InputBar
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
        />
        <Table
          title="Group Members"
          name={membersKey}
          columns={columns.members}
          data={members}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.memberOf}
          data={memberOf}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
