import Button from "./Button";

import { BsCheckCircle, BsExclamationOctagon, BsX } from "react-icons/bs";

type ToastProps = {
  toast: Toast;
  onDismiss: () => void;
};
export default function Toast({ toast, onDismiss }: ToastProps) {
  const { message, key, time, type } = toast;

  const icons: Record<Required<Toast>["type"], JSX.Element> = {
    error: <BsExclamationOctagon className="flex-shrink-0 text-xl text-red" />,
    info: <BsCheckCircle className="flex-shrink-0 text-xl text-primaryAccent" />,
  };

  return (
    <div className="flex items-center gap-2 rounded border-2 border-border bg-primary p-1 ps-2 drop-shadow-custom">
      {icons[type]}

      <span>{message}</span>

      <Button className="bg-dark p-0.5 text-xl text-red" onClick={onDismiss}>
        <BsX />
      </Button>
    </div>
  );
}
