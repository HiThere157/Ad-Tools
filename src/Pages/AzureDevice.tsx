import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { getPropertiesWrapper, makeToList } from "../Helper/postProcessors";
import { isAuthenticated, azureLogin } from "../Helper/azureAuth";
import { redirect } from "../Helper/redirects";

import AzureLogin from "../Components/Popups/AzureLogin";
import AadInputBar from "../Components/InputBars/InputAad";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsWindows } from "react-icons/bs";

export default function AzureDevicePage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AadQuery>(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_attribs`,
    {},
  );

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
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

    const devices = await makeAPICall<PSResult[]>({
      command: "Get-AzureADDevice",
      args: {
        SearchString: query.input,
      },
      postProcessor: makeToList,
      useStaticSession: true,
    });

    if (devices.error) {
      setAttributes({ output: [], error: devices.error });
      setIsLoading(false);
      return;
    }

    const firstResult = (await devices.output?.[0])?.[0];

    if (firstResult?.DisplayName === query.input) {
      await makeAPICall<PSResult[]>({
        command: "Get-AzureADDevice",
        args: {
          ObjectId: firstResult?.ObjectId.toString(),
        },
        postProcessor: getPropertiesWrapper,
        callback: setAttributes,
        useStaticSession: true,
      });
      setIsLoading(false);
      return;
    }

    setAttributes({
      output: [],
      error: `No Device found with Identifier "${query.input}"`,
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AzureLogin
        isOpen={loginPopup}
        onExit={() => setLoginPopup(false)}
        onSubmit={azureLogin}
      />
      <AadInputBar
        label="Azure Device:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={checkLogin}
      >
        <Button
          classOverride="p-1"
          onClick={() => {
            redirect("computer", { input: query.input });
          }}
        >
          <BsWindows />
        </Button>
      </AadInputBar>
      <TableLayout>
        <Table
          title="Device Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
