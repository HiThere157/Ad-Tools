type HintProps = {
  hint: string;
  slim?: boolean;
};
export default function Hint({ hint, slim = false }: HintProps) {
  return hint ? (
    <div className={"ml-1 dark:text-whiteColorAccent " + (!slim ? "mb-3" : "")}>{hint}</div>
  ) : (
    <></>
  );
}
