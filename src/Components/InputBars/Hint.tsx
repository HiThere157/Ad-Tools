type HintProps = {
  hint: string;
  classList?: string;
};
export default function Hint({ hint, classList = "" }: HintProps) {
  return hint ? (
    <div className={"ml-1 dark:text-whiteColorAccent " + classList}>{hint}</div>
  ) : (
    <></>
  );
}
