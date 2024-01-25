type ScoreProps = {
  label: string;
  value: number;
};
export default function Score({ label, value }: ScoreProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2 font-bold">
      <span className="text-2xl text-grey">{label}</span>
      <span className="text-4xl">{value}</span>
    </div>
  );
}
