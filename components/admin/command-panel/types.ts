export type CommandContext = {
  page: string;
  summary: string;
  capabilities: string[];
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
