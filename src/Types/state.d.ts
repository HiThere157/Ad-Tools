type Message = {
  timestamp?: number;
  timeoutId?: NodeJS.Timeout;
  type: "info" | "error";
  message: string;
  key?: string;
  timer?: number;
  skipIfExists?: boolean;
};

type GlobalState = {
  messages: Message[];
};
