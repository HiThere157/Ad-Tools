import { BsExclamationOctagon } from "react-icons/bs";

type TableErrorProps = {
  error: string;
};
export default function TableError({ error }: TableErrorProps) {
  return (
    <div className="mx-8 my-[0.875rem] flex items-center justify-center gap-2">
      <BsExclamationOctagon className="flex-shrink-0 text-2xl text-red" />
      <span className="text-red whitespace-pre">{error}</span>
    </div>
  );
}
