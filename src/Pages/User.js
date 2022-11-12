import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";

import {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
} from "../Helper/makeAPICall";

import InputBar from "../Components/InputBar";
import TableOfContents from "../Components/TableOfContents";
import ScrollPosition from "../Components/ScrollPosition";
import Table from "../Components/Table/Table";

import { columns } from "../Config/default";

export default function UserPage() {
  const p = useLocation().pathname.substring(1);
  // const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useSessionStorage(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage(`${p}_a`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage(`${p}_mo`, {});

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall(
      "Get-ADUser",
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

  // const memberOfRedirect = (entry) => {
  //   window.sessionStorage.setItem("group_id", JSON.stringify(entry.Name));
  //   window.sessionStorage.setItem("group_domain", JSON.stringify(domain));
  //   navigate("/group");
  // };

  return (
    <article>
      <InputBar
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <Table
        title="User Attributes"
        name={attribsKey}
        columns={columns.attribute}
        data={attribs}
      />
      <br />
      <Table
        title="User Memberships"
        name={memberOfKey}
        columns={columns.memberOf}
        data={memberOf}
        // onRedirect={memberOfRedirect}
      />
      <TableOfContents />
      <ScrollPosition name={p} />
    </article>
  );
}
