import { useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "../Helper/useStorage";
import useScrollPos from "../Helper/useScrollPos";

import {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
} from "../Helper/makeAPICall";

import Loader from "../Components/PulseLoader";
import TableOfContents from "../Components/TableOfContents";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table/Table";

import { domains, columns } from "../Config/default";

export default function UserPage() {
  const navigate = useNavigate();
  const articeRef = createRef();
  useScrollPos(articeRef, "user_scroll");

  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useSessionStorage("user_id", "");
  const [domain, setDomain] = useSessionStorage("user_domain", domains[0]);

  const [attributes, setAttributes] = useSessionStorage("user_attributes", {});
  const [memberOf, setMemberOf] = useSessionStorage("user_memberof", {});

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall(
      "Get-ADUser",
      {
        Identity: userID,
        Server: domain,
        Properties: "*",
      },
      [getPropertiesWrapper, getMembershipFromAdUser],
      [setAttributes, setMemberOf]
    );
    setIsLoading(false);
  };

  const memberOfRedirect = (entry) => {
    window.sessionStorage.setItem("group_id", JSON.stringify(entry.Name));
    window.sessionStorage.setItem("group_domain", JSON.stringify(domain));
    navigate("/group");
  };

  return (
    <article ref={articeRef}>
      <div className="input-bar">
        <Input
          label="User ID:"
          value={userID}
          onChange={setUserID}
          onEnter={runQuery}
        />
        <Dropdown items={domains} value={domain} onChange={setDomain} />
        <Button onClick={runQuery} disabled={isLoading} children="Run" />
        <Loader isVisible={isLoading} />
      </div>

      <div>
        <Table
          title="User Attributes"
          name="user_attributes"
          columns={columns.attribute}
          data={attributes}
        />
        <br />
        <Table
          title="User Memberships"
          name="user_memberof"
          columns={columns.memberOf}
          data={memberOf}
          onRedirect={memberOfRedirect}
        />
      </div>
      <TableOfContents />
    </article>
  );
}
