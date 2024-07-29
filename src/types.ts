import { SocketOptions, ManagerOptions } from "socket.io-client";

interface Message {
  content: any;
  createdAt: string;
  socketId: string;
}

interface LastEvaluatedKey extends Message {
  channelName: string;
  messageId: string;
}

interface NewState {
  [key: string]: string;
}
interface State extends NewState {
  socketId: string;
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
  [key: string]: any;
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
  NewState,
};
