import { useEffect, useRef, useCallback, useMemo } from "react";
import { Message } from "../../types.js";
import { useCerebellum } from "./useCerebellum.js";
export type CerebellumMessageCallback = (message: Message) => void;

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
