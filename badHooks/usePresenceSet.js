import { useEffect, useRef, useCallback } from "react";
import { socket } from "../sample_app/src/socket";

const usePresenceSet = (channelName, initialUserInfo) => {
  const userInfoRef = useRef(initialUserInfo);

  useEffect(() => {
    if (!channelName) return;

    socket.emit("presenceSet:enter", channelName, userInfoRef.current);
    console.log("enter");
    return () => {
      socket.emit("presenceSet:leave", channelName);
    };
  }, [channelName]);

  const updatePresenceInfo = useCallback(
    (updatedUserInfo) => {
      userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
      socket.emit("presence:update", channelName, userInfoRef.current);
    },
    [channelName]
  );

  return { updatePresenceInfo };
};

export default usePresenceSet;
