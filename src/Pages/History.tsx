import { useState } from "react";
import { useLocation } from "react-router-dom";

import { columns, commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "../Helper/indexedDB";

import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function SearchPage() {
  const p = useLocation().pathname.substring(1);
  const [history, setHistory] = useState<ResultData>({});

  try {
    const db = setupIndexedDB(commandDBConfig);
    (async () => {
      const commandStore = new Store(db, "commands", "readonly");
      const result = await commandStore.getAll<object[]>();
      setHistory({ output: result.reverse() });
    })();
  } catch (error: any) {
    setHistory({ output: [], error });
  }

  return (
    <article>
      <TableLayout>
        <Table
          title="Command History (last 500)"
          name={`${p}_h`}
          columns={columns.history}
          data={history}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
