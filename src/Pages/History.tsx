import { HistoryTables, Pages } from "../Config/const";

import Table from "../Components/Table/Table";

export default function History() {
  const page = Pages.History;

  return (
    <div className="px-4 py-2">
      <Table title="Query Log" page={page} tabId={0} name={HistoryTables.QueryLog} />
    </div>
  );
}
