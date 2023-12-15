import Button from "../Button";
import Popup from "./Popup";

type ConfirmProps = {
  isOpen: boolean;
  title: string;
  message: string;

  onExit: (selection: boolean) => void;
};
export default function Confirm({ isOpen, title, message, onExit }: ConfirmProps) {
  return (
    <Popup isOpen={isOpen} title={title} onCancel={() => onExit(false)}>
      <span>{message}</span>

      <div className="mt-3 flex justify-end gap-2">
        <Button className="bg-dark" onClick={() => onExit(false)}>
          Cancel
        </Button>
        <Button className="text-red" onClick={() => onExit(true)}>
          Yes
        </Button>
      </div>
    </Popup>
  );
}
