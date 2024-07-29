import { Message } from "../../types.js";
export type CerebellumMessageCallback = (message: Message) => void;
/**
 * The `useChannel` function in TypeScript is a custom hook that manages subscription to a channel and
 * allows publishing messages to that channel using Cerebellum.
 * @param {string} channelName - The `channelName` parameter is a string that represents the name of
 * the channel to subscribe to and publish messages on.
 * @param {CerebellumMessageCallback} onMessage - The `onMessage` parameter is a callback function that
 * will be called whenever a message is received on the specified channel.
 * @returns The `useChannel` hook returns an object with two properties:
 * 1. `channelName`: The current channel name being used.
 * 2. `publish`: A function that allows publishing a message to the current channel.
 */
export declare const useChannel: (channelName: string, onMessage: CerebellumMessageCallback) => {
    channelName: string;
    publish: (message: any) => void;
};
export default useChannel;
