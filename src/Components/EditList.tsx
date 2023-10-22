import Button from "./Button";
import Input from "./Input/Input";

import { BsPlusLg, BsTrashFill } from "react-icons/bs";

type EditListProps = {
  list: string[];
  onChange: (list: string[]) => void;
};
export default function EditList({ list, onChange }: EditListProps) {
  return (
    <div className="flex items-start gap-1 p-2">
      <div className="grid grid-cols-[1fr_auto] items-start gap-1">
        {list.map((item, itemIndex) => (
          <>
            <Input
              value={item}
              onChange={(value) => {
                const newList = [...list];
                newList[itemIndex] = value;
                onChange(newList);
              }}
            />

            <Button
              className="p-1 text-red"
              onClick={() => onChange(list.filter((_, index) => index !== itemIndex))}
            >
              <BsTrashFill />
            </Button>
          </>
        ))}
      </div>

      <Button className="p-1" onClick={() => onChange([...list, ""])}>
        <BsPlusLg />
      </Button>
    </div>
  );
}
