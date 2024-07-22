import { useEffect, useState, useRef, useCallback } from "react";
import { cerebellum } from "../socket";

const useChannel = (channelName, callback) => {
  const callbackRef = useRef(callback);
  const [currentChannel, setCurrentChannel] = useState(channelName);
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

    cerebellum.subscribeChannel(currentChannel, handleMessageReceive);

    return () => {
      cerebellum.unsubscribeChannel(previousChannel, handleMessageReceive);
    };
  }, [currentChannel]);

  const publish = useCallback(
    (messageData) => {
      cerebellum.publish(currentChannel, messageData);
    },
    [currentChannel]
  );

  const subscribe = (newChannel) => {
    setCurrentChannel(newChannel);
  };

  const unsubscribe = () => {
    setCurrentChannel(null);
  };

  return { publish, subscribe, unsubscribe };
};

export default useChannel;
