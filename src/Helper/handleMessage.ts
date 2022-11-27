import { GlobalState, Message } from "../Hooks/useGlobalState";

const addMessage = (
  message: Message,
  callback: (value: React.SetStateAction<Partial<GlobalState>>) => void
) => {
  message.timestamp = Date.now();

  callback((prev) => ({
    ...prev,
    messages: [...(prev.messages ?? []), message],
  }));
};

const removeMessage = (
  timestamp: number | undefined,
  callback: (value: React.SetStateAction<Partial<GlobalState>>) => void
) => {
  callback((prev) => ({
    ...prev,
    messages: (prev.messages ?? []).filter(
      (message) => message.timestamp !== timestamp
    ),
  }));
};

export { addMessage, removeMessage };
