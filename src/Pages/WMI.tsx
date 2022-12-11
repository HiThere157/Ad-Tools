import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import {
  replaceASCIIArray,
  getWMIPropertiesWrapper,
  makeToList,
} from "../Helper/postProcessors";
import { redirect } from "../Helper/redirects";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Button from "../Components/Button";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

import { BsDisplay } from "react-icons/bs";
import { AdQuery, ResultData } from "../Types/api";

export default function WMIPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [monitors, setMonitors, monitorsKey] = useSessionStorage<ResultData>(
    `${p}_monitors`,
    {},
  );
  const [sysinfo, setSysinfo, sysinfoKey] = useSessionStorage<ResultData>(
    `${p}_sysinfo`,
    {},
  );
  const [software, setSoftware, softwareKey] = useSessionStorage<ResultData>(
    `${p}_software`,
    {},
  );
  const [bios, setBios, biosKey] = useSessionStorage<ResultData>(
    `${p}_bios`,
    {},
  );

  const [reQuery, setReQuery] = useSessionStorage<boolean>(
    `${p}_reQuery`,
    false,
  );
  useEffect(() => {
    if (reQuery) runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reQuery]);

  const runQuery = async () => {
    setReQuery(false);
    setIsLoading(true);

    await Promise.all([
      makeAPICall({
        command: "Get-WmiObject",
        args: {
          ClassName: "WmiMonitorID",
          Namespace: "root/wmi",
          ComputerName: `${query.input}.${query.domain}`,
        },
        postProcessor: replaceASCIIArray,
        callback: setMonitors,
      }),
      makeAPICall({
        command: "Get-WmiObject",
        args: {
          ClassName: "Win32_ComputerSystem",
          ComputerName: `${query.input}.${query.domain}`,
        },
        postProcessor: getWMIPropertiesWrapper,
        callback: setSysinfo,
      }),
      makeAPICall({
        command: "Get-WmiObject",
        args: {
          ClassName: "Win32_Product",
          ComputerName: `${query.input}.${query.domain}`,
        },
        selectFields: columns.software.map((column) => column.key),
        postProcessor: makeToList,
        callback: setSoftware,
      }),
      makeAPICall({
        command: "Get-WmiObject",
        args: {
          ClassName: "Win32_bios",
          ComputerName: `${query.input}.${query.domain}`,
        },
        postProcessor: getWMIPropertiesWrapper,
        callback: setBios,
      }),
    ]);

    setIsLoading(false);
  };

  return (
    <article>
      <div className="w-fit">
        <AdInputBar
          label="Computer:"
          isLoading={isLoading}
          query={query}
          onChange={setQuery}
          onSubmit={runQuery}
        >
          <Button
            classOverride="p-1"
            onClick={() => redirect("computer", query)}
          >
            <BsDisplay />
          </Button>
        </AdInputBar>
      </div>
      <TableLayout>
        <Table
          title="Connected Monitors"
          name={monitorsKey}
          columns={columns.monitor}
          data={monitors}
          isLoading={isLoading}
        />
        <Table
          title="System Info"
          name={sysinfoKey}
          columns={columns.attribute}
          data={sysinfo}
          isLoading={isLoading}
        />
        <Table
          title="Installed Software"
          name={softwareKey}
          columns={columns.software}
          data={software}
          isLoading={isLoading}
        />
        <Table
          title="Bios Info"
          name={biosKey}
          columns={columns.attribute}
          data={bios}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
