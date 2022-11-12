import { useState } from "react";
import { useSessionStorage } from "../Helper/useStorage";

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
  const [isLoading, setIsLoading] = useState(false);
  const [groupID, setGroupID] = useSessionStorage("group_id", "");
  const [domain, setDomain] = useSessionStorage("group_domain", domains[0]);

  const [attributes, setAttributes] = useSessionStorage("group_attributes", []);
  const [memberOf, setMemberOf] = useSessionStorage("group_memberof", []);
  const [members, setMembers] = useSessionStorage("group_members", []);

  const [attributesError, setAttributesError] = useSessionStorage(
    "group_attributesError",
    {}
  );
  const [memberOfError, setMemberOfError] = useSessionStorage(
    "group_memberofError",
    {}
  );
  const [membersError, setMembersError] = useSessionStorage(
    "group_membersError",
    {}
  );

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
        [setAttributes, setMemberOf],
        [setAttributesError, setMemberOfError]
      ),
      makeAPICall(
        "Get-ADGroupMember",
        { Identity: groupID, Server: domain },
        makeToList,
        setMembers,
        setMembersError
      ),
    ]);

    setIsLoading(false);
  };

  return (
    <>
      <div className="input-bar">
        <Input
          label="User ID:"
          value={groupID}
          onChange={setGroupID}
          onEnter={runQuery}
        />
        <Dropdown items={domains} value={domain} onChange={setDomain} />
        <Button onClick={runQuery} disabled={isLoading}>
          Run
        </Button>
        <Loader isVisible={isLoading} />
      </div>

      <div>
        <Table
          title="Group Attributes"
          name="group_attributes"
          columns={columns.attribute}
          entries={attributes}
          error={attributesError}
        />
        <br />
        <Table
          title="Group Memberships"
          name="group_memberof"
          columns={columns.memberOf}
          entries={memberOf}
          error={memberOfError}
        />
        <br />
        <Table
          title="Group Members"
          name="group_members"
          columns={columns.members}
          entries={members}
          error={membersError}
        />
      </div>
      <TableOfContents />
    </>
  );
}
