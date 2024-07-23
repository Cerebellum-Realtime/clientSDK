import { CerebellumInit } from "../CerebellumInit";
import { Message } from "../types";
export declare const useChannel: (cerebellum: CerebellumInit, channelName: string, callback: (messages: Message[]) => any) => {
    publish: (messageData: string) => void;
    subscribe: (newChannel: string) => void;
    unsubscribe: () => void;
    getPastMessages: (limit?: number, sortDirection?: "ascending" | "descending") => Promise<import("../types").PastMessages | undefined>;
};
export default useChannel;
