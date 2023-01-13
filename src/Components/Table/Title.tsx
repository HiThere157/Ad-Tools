type TitleProps = {
  title: string;
  n: number;
  nSelected: number;
  nFiltered: number;
};
export default function Title({ title, n, nSelected, nFiltered }: TitleProps) {
  return (
    <div className="flex gap-x-2 items-baseline mb-1 ml-2">
      <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
        {title}
      </h2>
      <span className="dark:text-whiteColorAccent">
        {n} {n === 1 ? "Result" : "Results"}
      </span>

      {(nSelected !== 0 || nFiltered !== 0) && (
        <span className="dark:text-whiteColorAccent">
          ({nSelected !== 0 && `${nSelected} Selected`}
          {nSelected !== 0 && nFiltered !== 0 && ", "}
          {nFiltered !== 0 && `${nFiltered} Hidden`})
        </span>
      )}
    </div>
  );
}
