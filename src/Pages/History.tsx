import { useState } from "react";
import { useLocation } from "react-router-dom";

import { setupIndexedDB, Store } from "../Helper/indexedDB"

import { columns, commandDBConfig } from "../Config/default";
import TableLayout from "../Layouts/TableLayout";
import Table from "../Components/Table/Table";
import ScrollPosition from "../Components/ScrollPosition";

export default function SearchPage() {
  const p = useLocation().pathname.substring(1);
  const [history, setHistory] = useState({});

  try {
    const db = setupIndexedDB(commandDBConfig);
    (async () => {
      const commandStore = new Store(db, "commands", "readonly");
      const result = await commandStore.getAll<any>();
      setHistory({ output: result.reverse() });
    })()
  } catch (error) {
    setHistory({ output: [], error })
  }

  return (
    <article>
      <TableLayout>
        <Table
          title="Command History"
          name={`${p}_h`}
          columns={columns.history}
          data={history}
        />
      </TableLayout>
      <ScrollPosition name={p} />
    </article>
  );
}
