import { useEffect, useRef, useCallback, useMemo } from "react";
import { Message } from "../../types.js";
import { useCerebellum } from "./useCerebellum.js";
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
export const useChannel = (
  channelName: string,
  onMessage: CerebellumMessageCallback
) => {
  const onMessageRef = useRef(onMessage);
  const channelNameRef = useRef(channelName);
  const cerebellum = useCerebellum();

  useEffect(() => {
    onMessageRef.current = onMessage;
    channelNameRef.current = channelName;
  }, [onMessage, channelName]);

  useEffect(() => {
    const currentChannelName = channelNameRef.current;

    const handleMessage = (message: Message) => {
      onMessageRef.current && onMessageRef.current(message);
    };

    cerebellum.subscribeChannel(currentChannelName, handleMessage);
    return () => {
      cerebellum.unsubscribeChannel(currentChannelName, handleMessage);
    };
  }, [cerebellum]);
  /**
   * The `publish` function in TypeScript allows publishing a message to the current channel.
   * @param {any} message - The `message` parameter is a generic object that can represent any type
   * of data. It is used to publish a message to the current channel.
   * @returns The `publish` function returns a Promise that resolves when the message is published.
   */
  const publish = useCallback(
    (message: any) => {
      cerebellum.publish(channelNameRef.current, message);
    },
    [cerebellum]
  );

  return useMemo(
    () => ({
      channelName: channelNameRef.current,
      publish,
    }),
    [publish]
  );
};

export default useChannel;
