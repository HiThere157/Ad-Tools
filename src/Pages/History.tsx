import Table from "../Components/Table/Table";

export default function History() {
  const page = "history";

  return (
    <div className="px-4 py-2">
      <Table title="Query Log" page={page} tabId={0} name="queryLog" />
    </div>
  );
}
