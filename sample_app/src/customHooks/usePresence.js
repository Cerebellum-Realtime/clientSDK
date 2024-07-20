import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket";

const usePresence = (channelName, initialUserInfo) => {
  const [currentPresence] = useState(channelName);
  const [presenceData, setPresenceData] = useState([]);
  const userInfoRef = useRef(initialUserInfo);
  const previousPresenceRef = useRef(channelName);

  useEffect(() => {
    if (!currentPresence) {
      return;
    }
    const previousPresence = previousPresenceRef.current;

    const handlePresenceLeave = (socketId) => {
      setPresenceData((prevData) =>
        prevData.filter((data) => data.socketId !== socketId)
      );
    };

    const handlePresenceJoin = (response) => {
      setPresenceData((prevData) => [...prevData, response]);
    };

    const handlePresenceUpdate = (response) => {
      setPresenceData((prevData) =>
        prevData.map((data) =>
          data.socketId === response.socketId ? response : data
        )
      );
    };

    const handlePresenceSubscribe = (ack) => {
      if (ack.success === true) {
        setPresenceData(ack.users);

        socket.emit("presenceSet:enter", currentPresence, userInfoRef.current);
      }
    };

    socket.on(`presence:${currentPresence}:leave`, handlePresenceLeave);
    socket.on(`presence:${currentPresence}:join`, handlePresenceJoin);
    socket.on(`presence:${currentPresence}:update`, handlePresenceUpdate);

    const handleSocketConnect = () => {
      socket.emit(
        "presence:subscribe",
        currentPresence,
        handlePresenceSubscribe
      );
    };
    handleSocketConnect();
    socket.on("connect", handleSocketConnect);
    //When user disconnects he is unsubscribed on the backend, so we need to resubscribe him

    return () => {
      socket.emit("presenceSet:leave", previousPresence);
      socket.emit(`presence:unsubscribe`, previousPresence);
      socket.off("connect", handleSocketConnect);

      socket.off(`presence:${previousPresence}:leave`, handlePresenceLeave);
      socket.off(`presence:${previousPresence}:join`, handlePresenceJoin);
      socket.off(`presence:${previousPresence}:update`, handlePresenceUpdate);
    };
  }, [currentPresence]);

  const updatePresenceInfo = useCallback(
    (updatedUserInfo) => {
      userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
      socket.emit("presence:update", currentPresence, userInfoRef.current);
    },
    [currentPresence]
  );

  return { presenceData, updatePresenceInfo };
};

export default usePresence;
