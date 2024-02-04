import { BsPersonFill, BsPeopleFill, BsDisplay, BsDiagram3Fill, BsCpu } from "react-icons/bs";

type ResultLabelProps = {
  icon: "user" | "group" | "computer" | "replication" | "wmi";
  attributes: DataSet;
};
export default function ResultLabel({ icon, attributes }: ResultLabelProps) {
  const displayName = attributes?.data?.find(({ key }) => key == "DisplayName")?.Value;

  const iconClasses = "flex-shrink-0 text-4xl text-primaryAccent";
  const icons: Record<Required<ResultLabelProps>["icon"], JSX.Element> = {
    user: <BsPersonFill className={iconClasses} />,
    group: <BsPeopleFill className={iconClasses} />,
    computer: <BsDisplay className={iconClasses} />,
    replication: <BsDiagram3Fill className={iconClasses} />,
    wmi: <BsCpu className={iconClasses} />,
  };

  if (!displayName) return null;

  return (
    <div className="mb-3 flex items-center gap-2">
      {icons[icon]}
      <h1>{displayName}</h1>
    </div>
  );
}
