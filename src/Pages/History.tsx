import { HistoryTables, Pages } from "../Config/const";
import { useTabState } from "../Hooks/useTabState";

import Table from "../Components/Table/Table";

export default function History() {
  const page = Pages.History;
  const { dataSets, tableStates, setTableState } = useTabState(page);

  return (
    <div className="px-4 py-2">
      <Table
        title="Query Log"
        dataSet={dataSets[HistoryTables.QueryLog]}
        tableState={tableStates[HistoryTables.QueryLog]}
        setTableState={(state) => setTableState(HistoryTables.QueryLog, state)}
      />
    </div>
  );
}
