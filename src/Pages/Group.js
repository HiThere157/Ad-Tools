import { useState, createRef } from "react";
import { useSessionStorage } from "../Helper/useStorage";
import useScrollPos from "../Helper/useScrollPos";

import {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
  makeToList,
} from "../Helper/makeAPICall";

import Loader from "../Components/PulseLoader";
import TableOfContents from "../Components/TableOfContents";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table/Table";

import { domains, columns } from "../Config/default";

export default function GroupPage() {
  const articeRef = createRef();
  useScrollPos(articeRef, "group_scroll");

  const [isLoading, setIsLoading] = useState(false);
  const [groupID, setGroupID] = useSessionStorage("group_id", "");
  const [domain, setDomain] = useSessionStorage("group_domain", domains[0]);

  const [attributes, setAttributes] = useSessionStorage("group_attributes", {});
  const [memberOf, setMemberOf] = useSessionStorage("group_memberof", {});
  const [members, setMembers] = useSessionStorage("group_members", {});

  const runQuery = async () => {
    setIsLoading(true);
    await Promise.all([
      makeAPICall(
        "Get-ADGroup",
        {
          Identity: groupID,
          Server: domain,
          Properties: "*",
        },
        [getPropertiesWrapper, getMembershipFromAdUser],
        [setAttributes, setMemberOf]
      ),
      makeAPICall(
        "Get-ADGroupMember",
        { Identity: groupID, Server: domain },
        makeToList,
        setMembers
      ),
    ]);
    setIsLoading(false);
  };

  return (
    <article ref={articeRef}>
      <div className="input-bar">
        <Input
          label="Group ID:"
          value={groupID}
          onChange={setGroupID}
          onEnter={runQuery}
        />
        <Dropdown items={domains} value={domain} onChange={setDomain} />
        <Button onClick={runQuery} disabled={isLoading} children="Run" />
        <Loader isVisible={isLoading} />
      </div>

      <div>
        <Table
          title="Group Attributes"
          name="group_attributes"
          columns={columns.attribute}
          data={attributes}
        />
        <br />
        <Table
          title="Group Members"
          name="group_members"
          columns={columns.members}
          data={members}
        />
        <br />
        <Table
          title="Group Memberships"
          name="group_memberof"
          columns={columns.memberOf}
          data={memberOf}
        />
      </div>
      <TableOfContents />
    </article>
  );
}
