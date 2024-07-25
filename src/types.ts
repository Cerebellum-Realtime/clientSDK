import { SocketOptions, ManagerOptions } from "socket.io-client";

interface Message {
  content: any;
  createdAt: string;
}

interface LastEvaluatedKey extends Message {
  channelName: string;
  messageId: string;
}

interface State {
  [key: string]: string;
}

interface Acknowledgement {
  success: boolean;
  users?: State[];
  pastMessages?: Message[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

interface getPastMessagesOptions {
  limit?: number;
  sortDirection?: "ascending" | "descending";
  lastEvaluatedKey?: LastEvaluatedKey;
}

interface PastMessages {
  messages: Message[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

interface Payload {
  [key: string]: string | number | boolean;
}

interface AuthRoute {
  endpoint: string;
  method: "POST" | "GET";
  payload: Payload;
}

interface CerebellumOptions extends Partial<ManagerOptions & SocketOptions> {
  API_KEY?: string;
  authRoute?: AuthRoute;
}

export {
  CerebellumOptions,
  Message,
  Acknowledgement,
  getPastMessagesOptions,
  PastMessages,
  Payload,
  State,
  LastEvaluatedKey,
};
