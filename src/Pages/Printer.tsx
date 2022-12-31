import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSessionStorage } from "../Hooks/useStorage";

import { columns } from "../Config/default";
import { makeAPICall } from "../Helper/makeAPICall";
import { replacePrinterStatus } from "../Helper/postProcessors";

import AdInputBar from "../Components/InputBars/InputAd";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function PrinterPage() {
  const p = useLocation().pathname.substring(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useSessionStorage<AdQuery>(`${p}_query`, {});

  const [printers, setPrinters, printersKey] = useSessionStorage<Result<PSResult[]>>(
    `${p}_printers`,
    {},
  );

  const runQuery = async () => {
    setIsLoading(true);
    await makeAPICall<PSResult[]>({
      command: "Get-Printer",
      args: {
        ComputerName: `${query.input}.${query.domain}`,
      },
      postProcessor: replacePrinterStatus,
      callback: setPrinters,
    });
    setIsLoading(false);
  };

  return (
    <article>
      <AdInputBar
        label="Print Server:"
        isLoading={isLoading}
        query={query}
        onChange={setQuery}
        onSubmit={runQuery}
      />
      <TableLayout>
        <Table
          title="Printers"
          name={printersKey}
          columns={columns.printer}
          data={printers}
          isLoading={isLoading}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
