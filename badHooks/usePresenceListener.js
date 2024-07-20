import { useEffect, useState } from "react";
import { socket } from "../sample_app/src/socket";

const usePresenceListener = (channelName) => {
  const [presenceData, setPresenceData] = useState([]);

  useEffect(() => {
    if (!channelName) return;

    const handlePresenceLeave = (socketId) => {
      setPresenceData((prevData) =>
        prevData.filter((data) => data.socketId !== socketId)
      );
    };

    const handlePresenceJoin = (response) => {
      console.log("recieved a person from the server", response);
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
        console.log("initial");
        setPresenceData(ack.users);

        socket.on(`presence:${channelName}:leave`, handlePresenceLeave);
        socket.on(`presence:${channelName}:join`, handlePresenceJoin);
        socket.on(`presence:${channelName}:update`, handlePresenceUpdate);
      }
    };

    const subscribeToPresence = () => {
      socket.emit("presence:subscribe", channelName, handlePresenceSubscribe);
    };

    socket.on("connect", subscribeToPresence);

    subscribeToPresence();

    return () => {
      socket.emit(`presence:unsubscribe`, channelName);
      socket.off("connect", subscribeToPresence);
      socket.off(`presence:${channelName}:leave`, handlePresenceLeave);
      socket.off(`presence:${channelName}:join`, handlePresenceJoin);
      socket.off(`presence:${channelName}:update`, handlePresenceUpdate);
    };
  }, [channelName]);

  return { presenceData };
};

export default usePresenceListener;
