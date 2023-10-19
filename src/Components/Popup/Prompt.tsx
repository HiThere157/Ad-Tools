import { useState } from "react";

import Input from "../Input/Input";
import Button from "../Button";

import Popup from "./Popup";

type PromptProps = {
  isOpen: boolean;
  title: string;
  label: string;
  onSubmit: (value: string | null) => void;
};
export default function Prompt({ isOpen, title, label, onSubmit }: PromptProps) {
  const [value, setValue] = useState("");

  const submitPopup = () => {
    onSubmit(value);
    setValue("");
  };

  const onCancel = () => {
    onSubmit(null);
    setValue("");
  };

  return (
    <Popup isOpen={isOpen} title={title} onCancel={onCancel}>
      <div className="flex gap-2">
        <span>{label}</span>
        <Input autoFocus={true} value={value} onChange={setValue} onEnter={submitPopup} />
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={submitPopup}>Submit</Button>
      </div>
    </Popup>
  );
}
