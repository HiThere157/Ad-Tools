import { useGlobalState } from "../Hooks/useGlobalState";
import { removeMessage } from "../Helper/handleMessage";

import Button from "../Components/Button";

import { BsExclamationOctagon, BsCheckCircle, BsXLg } from "react-icons/bs";

type MessageProps = {
  message: Message;
};
export default function MessageElement({ message }: MessageProps) {
  const { setState } = useGlobalState();

  if (message.timer && !message.timeoutId) {
    message.timeoutId = setTimeout(() => {
      closeMessage();
    }, message.timer * 1000);
  }

  const closeMessage = () => {
    removeMessage({ timestamp: message.timestamp }, setState);
  };

  const getTypeInfo = () => {
    switch (message.type) {
      case "error":
        return ["border-x-redColor", <BsExclamationOctagon />];
      case "info":
        return ["border-x-elAccentBg", <BsCheckCircle />];
      case "warning":
        return ["border-x-orangeColor", <BsExclamationOctagon />];
    }
  };

  return (
    <div
      className={
        "container flex justify-center items-center gap-x-2 border-x-4 px-2 py-1 text-xl " +
        getTypeInfo()[0]
      }
    >
      {getTypeInfo()[1]}
      <span className="text-lg">{message.message}</span>
      <Button className="p-1.5 text-xs" onClick={closeMessage}>
        <BsXLg />
      </Button>
    </div>
  );
}
