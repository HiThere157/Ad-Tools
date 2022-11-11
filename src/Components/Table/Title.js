export default function Title({ title, results }) {
  return (
    <div className="flex space-x-2 items-baseline mb-1 ml-2">
      <h2 className="text-2xl font-bold pt-4">{title}</h2>
      <span className="dark:text-foregroundAccent">
        {results.length} Results
      </span>
    </div>
  );
}
