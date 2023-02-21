type HintProps = {
  hint: string;
};
export default function Hint({ hint }: HintProps) {
  return hint ? <div className="ml-1 mb-3 dark:text-whiteColorAccent">{hint}</div> : <></>;
}
