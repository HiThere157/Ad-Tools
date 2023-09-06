type TableHeaderProps = {
  title: string;
};
export default function TableHeader({ title }: TableHeaderProps) {
  return (
    <div>
      <h2 className="font-bold">{title}</h2>
    </div>
  );
}
