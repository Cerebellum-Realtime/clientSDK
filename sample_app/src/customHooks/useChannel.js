import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket";

const useChannel = (channelName, callback) => {
  const callbackRef = useRef(callback);
  const [currentChannel, setCurrentChannel] = useState(channelName);
  const previousChannelRef = useRef(channelName);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  //Usage: Storing a mutable value that doesn't require re-rendering when updated.
  // The .current property can be mutated without causing a re-render.
  // Persists the same reference between re-renders.

  useEffect(() => {
    if (!currentChannel) {
      return;
    }
    const previousChannel = previousChannelRef.current;

    socket.emit("channel:subscribe", currentChannel, (ack) => {
      if (ack.success) {
        if (ack.pastMessages) {
          callbackRef.current(ack.pastMessages);
        }
      } else {
        console.error(`Failed to subscribe to channel ${currentChannel}`);
      }
    });

    const handleMessageReceive = callbackRef.current;

    socket.on(`message:receive:${currentChannel}`, handleMessageReceive);

    return () => {
      socket.emit(`channel:unsubscribe`, previousChannel, (ack) => {
        if (ack.success) {
          console.log(`Unsubscribed from channel ${previousChannel}`);
        } else {
          console.error(
            `Failed to unsubscribe from channel ${previousChannel}`
          );
        }
      });
      socket.off(`message:receive:${previousChannel}`, handleMessageReceive);
    };
  }, [currentChannel]);

  const queue = useCallback(
    (messageData) => {
      socket.emit("message:queue", currentChannel, messageData);
    },
    [currentChannel]
  );
  //Purpose: Memoizes a function, returning a cached version of the function.
  // Usage: Typically used for optimizing performance, especially when passing callbacks to child components.
  // To avoid recreating functions on every render when they're used in dependency arrays of other hooks.

  const subscribe = (newChannel) => {
    setCurrentChannel(newChannel);
  };

  const unsubscribe = () => {
    setCurrentChannel(null);
  };

  return { queue, subscribe, unsubscribe };
};

export default useChannel;
