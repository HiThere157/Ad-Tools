type Message = {
  timestamp?: number;
  timeoutId?: NodeJS.Timeout;
  type: "info" | "error" | "warning";
  message: string;
  timer?: number;
  skipIfExists?: boolean;
};

type GlobalState = {
  messages: Message[];
};
