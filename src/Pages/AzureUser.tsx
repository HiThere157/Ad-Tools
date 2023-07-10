import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { isAuthenticated } from "../Helper/azureAuth";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  getPropertiesWrapper,
  getExtensionsFromAadUser,
  makeToList,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import Button from "../Components/Button";
import AzureLogin from "../Components/Popups/AzureLogin";
import AadInputBar from "../Components/InputBars/InputAad";
import Title from "../Components/Title";
import Hint from "../Components/Hint";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsWindows } from "react-icons/bs";

export default function AzureUserPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AadQuery>(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_attribs`,
    {},
  );
  const [ext, setExt, extKey] = useSessionStorage<Result<PSResult[]>>(`${p}_ext`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_memberOf`,
    {},
  );
  const [devices, setDevices, devicesKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_devices`,
    {},
  );

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const [loginPopup, setLoginPopup] = useState<boolean>(false);
  const checkLogin = async () => {
    if (await isAuthenticated()) return runQuery();
    setLoginPopup(true);
  };

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    setAttributes({ output: [] });
    setExt({ output: [] });
    setMemberOf({ output: [] });
    setDevices({ output: [] });

    await makeAPICall<PSResult[]>({
      command: "Get-AzureADUser",
      args: {
        ObjectId: query.input,
      },
      postProcessor: [getPropertiesWrapper, getExtensionsFromAadUser],
      callback: [setAttributes, setExt],
      useStaticSession: true,
    });
    await makeAPICall<PSResult[]>({
      command: "Get-AzureADUserMembership",
      args: {
        ObjectId: query.input,
        All: "1",
      },
      selectFields: columns.azureGroup,
      postProcessor: makeToList,
      callback: setMemberOf,
      useStaticSession: true,
    });
    await makeAPICall<PSResult[]>({
      command: "Get-AzureADUserRegisteredDevice",
      args: {
        ObjectId: query.input,
        All: "1",
      },
      selectFields: columns.azureDevice,
      postProcessor: makeToList,
      callback: setDevices,
      useStaticSession: true,
    });

    setIsLoading(false);
  };

  return (
    <article>
      <AzureLogin
        isOpen={loginPopup}
        onExit={(loggedIn?: boolean) => {
          setLoginPopup(false);
          if (loggedIn) runQuery();
        }}
      />
      <AadInputBar
        label="Azure User:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={checkLogin}
      >
        <Title text="Show AD User Page" position="bottom">
          <Button
            className="p-1"
            onClick={() => {
              redirect("user", { input: query.input?.split("@")[0] });
            }}
          >
            <BsWindows />
          </Button>
        </Title>
      </AadInputBar>
      <Hint
        hint="Hint: full user principal name is required (Eg.: kochda7@example.com)"
        className="mb-3"
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
          onRedirect={(entry: { DisplayName?: string }) => {
            redirect("azureGroup", {
              input: entry.DisplayName,
            });
          }}
          isLoading={isLoading}
        />
        <Table
          title="Registered Devices"
          name={devicesKey}
          columns={columns.azureDevice}
          data={devices}
          onRedirect={(entry: { DisplayName?: string }) => {
            redirect("azureDevice", {
              input: entry.DisplayName,
            });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
