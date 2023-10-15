import { BsExclamationOctagon } from "react-icons/bs";

type TableErrorProps = {
  error: string;
};
export default function TableError({ error }: TableErrorProps) {
  return (
    <div className="mx-8 flex min-h-[3rem] items-center justify-center gap-2">
      <BsExclamationOctagon className="flex-shrink-0 text-2xl text-red" />
      <span className="text-red">{error}</span>
    </div>
  );
}
