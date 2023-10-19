import Button from "../Button";
import Popup from "./Popup";

type ConfirmProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onSubmit: (selection: boolean) => void;
};
export default function Confirm({ isOpen, title, message, onSubmit }: ConfirmProps) {
  return (
    <Popup isOpen={isOpen} title={title} onCancel={() => onSubmit(false)}>
      <span>{message}</span>

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={() => onSubmit(false)}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(true)}>Yes</Button>
      </div>
    </Popup>
  );
}
