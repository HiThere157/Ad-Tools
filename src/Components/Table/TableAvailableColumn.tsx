import { BsPlus } from "react-icons/bs";

type TableAvailableColumnProps = {
  columnName: string;
  onAdd: () => void;
};
export default function TableAvailableColumn({ columnName, onAdd }: TableAvailableColumnProps) {
  return (
    <button
      className="relative rounded-full bg-secondary px-2 pe-7 outline-none outline-offset-0 hover:bg-secondaryActive focus-visible:outline-borderActive active:bg-primary"
      onClick={onAdd}
    >
      <span>{columnName}</span>
      <div className="absolute right-1 top-1/2 translate-y-[-50%] text-lg" onClick={onAdd}>
        <BsPlus />
      </div>
    </button>
  );
}
