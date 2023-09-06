import TableElement from "./TableElement";
import TableHeader from "./TableHeader";

type TableProps = {
  dataSet: DataSet<Loadable<PSResult>>;
};
export default function Table({ dataSet }: TableProps) {
  const { key, timestamp, title, data, columns } = dataSet;

  return (
    <section>
      <TableHeader title={title} />

      <div className="w-fit">
        <TableElement data={data} columns={columns} />
      </div>
    </section>
  );
}
