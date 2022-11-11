import { useState } from "react";
import { useSessionStorage } from "../Helper/useStorage";

import {
  makeAPICall,
  getPropertiesWrapper,
  makeToList,
} from "../Helper/makeAPICall";

import Loader from "../Components/PulseLoader";
import TableOfContents from "../Components/TableOfContents";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table/Table";

import { domains, columns } from "../Config/default";

export default function UserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useSessionStorage("user_userid", "");
  const [domain, setDomain] = useSessionStorage("user_domain", domains[0]);

  const [attributes, setAttributes] = useSessionStorage("user_attributes", []);
  const [memberOf, setMemberOf] = useSessionStorage("user_memberof", []);

  const [attributesError, setAttributesError] = useSessionStorage(
    "user_attributesError",
    {}
  );
  const [memberOfError, setMemberOfError] = useSessionStorage(
    "user_memberofError",
    {}
  );

  const runQuery = async () => {
    setIsLoading(true);

    await Promise.all([
      makeAPICall(
        "Get-ADUser",
        {
          Identity: userID,
          Server: domain,
          Properties: "*",
        },
        getPropertiesWrapper,
        setAttributes,
        setAttributesError
      ),
      makeAPICall(
        "Get-ADPrincipalGroupMembership",
        {
          Identity: userID,
          Server: domain,
        },
        makeToList,
        setMemberOf,
        setMemberOfError
      ),
    ]);

    setIsLoading(false);
  };

  return (
    <>
      <TableOfContents />
      <div className="input-bar">
        <Input
          label="User ID:"
          value={userID}
          onChange={setUserID}
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
          title="User Attributes"
          name="user_attributes"
          columns={columns.attribute}
          entries={attributes}
          error={attributesError}
        />
        <br />
        <Table
          title="User Memberships"
          name="user_memberof"
          columns={columns.memberOf}
          entries={memberOf}
          error={memberOfError}
        />
      </div>
    </>
  );
}
