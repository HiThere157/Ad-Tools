import { useState } from "react";

import Input from "../Input/Input";
import Button from "../Button";
import Popup from "./Popup";

type PromptProps = {
  isOpen: boolean;
  title: string;
  label: string;
  defaultValue?: string;
  onExit: (value: string | null) => void;
};
export default function Prompt({ isOpen, title, label, defaultValue, onExit }: PromptProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  const onSubmit = () => {
    onExit(value);
    setValue("");
  };

  const onCancel = () => {
    onExit(null);
    setValue("");
  };

  return (
    <Popup isOpen={isOpen} title={title} onCancel={onCancel}>
      <div className="flex gap-2">
        <span>{label}</span>
        <Input autoFocus={true} value={value} onChange={setValue} onEnter={onSubmit} />
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </Popup>
  );
}
