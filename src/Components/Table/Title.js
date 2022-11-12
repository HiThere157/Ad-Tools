export default function Title({ title, n }) {
  return (
    <div className="flex space-x-2 items-baseline mb-1 ml-2">
      <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
        {title}
      </h2>
      <span className="dark:text-foregroundAccent">{n} Results</span>
    </div>
  );
}
