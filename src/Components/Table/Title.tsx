import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type TitleProps = {
  title: string;
  n: number;
  nSelected: number;
  nFiltered: number;
  isTableOpen: boolean;
  setTableOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};
export default function Title({
  title,
  n,
  nSelected,
  nFiltered,
  isTableOpen,
  setTableOpen,
  children,
}: TitleProps) {
  return (
    <div className="flex mb-1 ml-1">
      <button className="text-2xl mr-1 outline-none" onClick={() => setTableOpen(!isTableOpen)}>
        {isTableOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <div className="flex items-baseline">
        <button
          className="flex items-center gap-2 mr-2 outline-none"
          onClick={() => setTableOpen(!isTableOpen)}
        >
          <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
            {title}
          </h2>
          {children}
        </button>
        <span className="dark:text-whiteColorAccent mr-1">
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
    </div>
  );
}
