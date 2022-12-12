import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { getPropertiesWrapper, getMembershipFromAdUser } from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { VscAzure } from "react-icons/vsc";

export default function UserPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [attribs, setAttributes, attribsKey] = useSessionStorage<ResultData>(`${p}_attribs`, {});
  const [memberOf, setMemberOf, memberOfKey] = useSessionStorage<ResultData>(`${p}_memberOf`, {});

  const [reQuery, setReQuery] = useSessionStorage<boolean>(`${p}_reQuery`, false);
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);
    await makeAPICall({
      command: "Get-ADUser",
      args: {
        Identity: query.input,
        Server: query.domain,
        Properties: "*",
      },
      postProcessor: [getPropertiesWrapper, getMembershipFromAdUser],
      callback: [setAttributes, setMemberOf],
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="User:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      >
        <Button
          classOverride="p-1"
          onClick={() => {
            redirect("azureUser", { input: `${query.input}@${query.domain}` });
          }}
        >
          <VscAzure />
        </Button>
      </AdInputBar>
      <TableLayout>
        <Table
          title="User Attributes"
          name={attribsKey}
          columns={columns.attribute}
          data={attribs}
          isLoading={isLoading}
        />
        <Table
          title="Group Memberships"
          name={memberOfKey}
          columns={columns.default}
          data={memberOf}
          onRedirect={(entry: { Name?: string }) => {
            redirect("group", { input: entry.Name, domain: query.domain });
          }}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
