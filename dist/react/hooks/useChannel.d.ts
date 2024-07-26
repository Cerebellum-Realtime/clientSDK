import { Message } from "../../types.js";
export type CerebellumMessageCallback = (message: Message) => void;
export declare const useChannel: (channelName: string, onMessage: CerebellumMessageCallback) => {
    channelName: string;
    publish: (message: any) => void;
};
export default useChannel;
