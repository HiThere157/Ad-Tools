import { GlobalState, Message } from "../Hooks/useGlobalState";

export default function addMessage(
  message: Message,
  callback: (value: React.SetStateAction<Partial<GlobalState>>) => void
) {
  callback((prev) => ({
    ...prev,
    messages: [...(prev.messages ?? []), message],
  }));
}
