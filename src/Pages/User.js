import { useState } from "react";
import { useSessionStorage } from "../Helper/useStorage";

import {
  makeAPICall,
  getPropertiesWrapper,
  makeToList,
} from "../Helper/makeAPICall";

import PulseLoader from "react-spinners/PulseLoader";

import Input from "../Components/Input";
import Button from "../Components/Button";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table/Table";

export default function UserPage() {
  const domains = ["Alcon.net", "Alconnet.com", "Itlab.local"];
  const attributeColumns = [
    { title: "Key", key: "key", sortable: true },
    { title: "Value", key: "value", sortable: true },
  ];
  const memberofColumns = [
    { title: "Name", key: "name", sortable: true },
    { title: "Distinguished Name", key: "distinguishedName", sortable: true },
  ];

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
    setAttributes([]);
    setMemberOf([]);
    setAttributesError({});
    setMemberOfError({});
    setIsLoading(true);

    await Promise.all([
      makeAPICall(
        "Get-ADUser",
        {
          Identity: userID,
          Server: domain,
          Properties: "*"
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
    <div className="text-lg">
      <div className="flex space-x-2 items-center mb-5">
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
        <PulseLoader
          size="12px"
          color="#208CF0"
          loading={isLoading}
          speedMultiplier="0.75"
        />
      </div>

      <div>
        <Table
          name="user_attributes"
          columns={attributeColumns}
          entries={attributes}
          error={attributesError}
        />
        <br />
        <Table
          name="user_memberof"
          columns={memberofColumns}
          entries={memberOf}
          error={memberOfError}
        />
      </div>
    </div>
  );
}
