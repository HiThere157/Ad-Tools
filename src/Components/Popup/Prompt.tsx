import { useEffect, useState } from "react";

import Input from "../Input/Input";
import Button from "../Button";
import Popup from "./Popup";

import { BsLightbulbFill } from "react-icons/bs";

type PromptProps = {
  isOpen: boolean;
  title: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  onExit: (value: string | null) => void;
};
export default function Prompt({ isOpen, title, label, hint, defaultValue, onExit }: PromptProps) {
  const [value, setValue] = useState("");

  const onSubmit = () => {
    onExit(value);
    setValue("");
  };

  const onCancel = () => {
    onExit(null);
    setValue("");
  };

  // Reset value to default when opening
  useEffect(() => {
    if (isOpen) setValue(defaultValue ?? "");
  }, [isOpen, defaultValue]);

  return (
    <Popup isOpen={isOpen} title={title} onCancel={onCancel}>
      <div className="flex gap-2">
        <span>{label}</span>
        <Input autoFocus={true} value={value} onChange={setValue} onEnter={onSubmit} />
      </div>

      {hint && (
        <div className="mx-1 mt-1 flex items-center gap-2 text-grey">
          <BsLightbulbFill />
          <span className="w-min flex-grow">{hint}</span>
        </div>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </Popup>
  );
}
