type HintProps = {
  hint: string;
  className?: string;
};
export default function Hint({ hint, className = "" }: HintProps) {
  return hint ? <div className={"ml-1 text-whiteColorAccent " + className}>{hint}</div> : <></>;
}
