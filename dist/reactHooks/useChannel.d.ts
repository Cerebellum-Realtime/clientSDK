import { CerebellumInit } from "../CerebellumInit";
import { Message } from "../types";
export declare const useChannel: (cerebellum: CerebellumInit, channelName: string, callback: (messages: Message) => any) => {
    publish: (messageData: any) => void;
    subscribe: (newChannel: string) => void;
    unsubscribe: () => void;
    getPastMessages: (limit?: number, sortDirection?: "ascending" | "descending") => Promise<Message[] | undefined>;
};
export default useChannel;
