const addMessage = (
  message: Message,
  callback: (value: React.SetStateAction<Partial<GlobalState>>) => void,
) => {
  message.timestamp = Date.now();

  const append = (prev: Partial<GlobalState>, message: Message) => {
    if (
      message.skipIfExists &&
      prev.messages?.some((existingMessage: Message) => existingMessage.message === message.message)
    ) {
      return prev.messages;
    }

    return [...(prev.messages ?? []), message];
  };

  callback((prev) => ({
    ...prev,
    messages: append(prev, message),
  }));

  return message.timestamp;
};

const removeMessage = (
  options: {
    timestamp?: number;
    key?: string;
  },
  callback: (value: React.SetStateAction<Partial<GlobalState>>) => void,
) => {
  callback((prev) => ({
    ...prev,
    messages: (prev.messages ?? []).filter((message) => {
      const isTimeStampMatch = message.timestamp === options.timestamp;
      const isKeyMatch = message.key === options.key && message.key;
      return !(isKeyMatch || isTimeStampMatch);
    }),
  }));
};

export { addMessage, removeMessage };
