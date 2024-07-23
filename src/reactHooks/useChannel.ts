import { useEffect, useState, useRef, useCallback } from "react";
import { CerebellumInit } from "../CerebellumInit";
import { Message, LastEvaluatedKey } from "../types";

export const useChannel = (
  cerebellum: CerebellumInit,
  channelName: string,
  callback: (messages: Message[]) => any
) => {
  const callbackRef = useRef(callback);
  const [currentChannel, setCurrentChannel] = useState<string | null>(
    channelName
  );
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<
    LastEvaluatedKey | undefined
  >(undefined);
  const previousChannelRef = useRef(channelName);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!currentChannel) {
      return;
    }

    const previousChannel = previousChannelRef.current;
    const handleMessageReceive = callbackRef.current;

    const fetchMessages = async () => {
      const { messages, lastEvaluatedKey } = await cerebellum.getPastMessages(
        currentChannel
      );
      setCurrentLastEvaluatedKey(lastEvaluatedKey);
      handleMessageReceive(messages);
      cerebellum.subscribeChannel(currentChannel, handleMessageReceive);
    };

    fetchMessages();

    return () => {
      cerebellum.unsubscribeChannel(previousChannel, handleMessageReceive);
    };
  }, [currentChannel]);

  const publish = useCallback(
    (messageData: string) => {
      if (currentChannel) {
        cerebellum.publish(currentChannel, messageData);
      }
    },
    [currentChannel]
  );

  const subscribe = (newChannel: string) => {
    setCurrentChannel(newChannel);
  };

  const unsubscribe = () => {
    setCurrentChannel(null);
  };

  const getPastMessages = async (
    limit = 50,
    sortDirection: "ascending" | "descending" = "ascending"
  ) => {
    if (!currentChannel) throw new Error("No channel selected");
    try {
      return await cerebellum.getPastMessages(currentChannel, {
        limit,
        sortDirection,
        lastEvaluatedKey: currentLastEvaluatedKey,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { publish, subscribe, unsubscribe, getPastMessages };
};

export default useChannel;
