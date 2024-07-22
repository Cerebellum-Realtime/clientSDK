import { useEffect, useState, useRef, useCallback } from "react";
import { cerebellum } from "../socket";

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

    const handleSocketConnect = async () => {
      await cerebellum.getPresenceSetMembers(currentPresence, setPresenceData);

      cerebellum.enterPresenceSet(currentPresence, userInfoRef.current);
    };

    handleSocketConnect();
    cerebellum.on("connect", handleSocketConnect);
    cerebellum.subscribeToPresenceJoins(currentPresence, handlePresenceJoin);
    cerebellum.subscribeToPresenceUpdates(
      currentPresence,
      handlePresenceUpdate
    );
    cerebellum.subscribeToPresenceLeaves(currentPresence, handlePresenceLeave);

    return () => {
      cerebellum.leavePresenceSet(previousPresence);
      cerebellum.off("connect", handleSocketConnect);

      cerebellum.unsubscribeFromPresenceJoins(
        previousPresence,
        handlePresenceJoin
      );
      cerebellum.unsubscribeFromPresenceLeaves(
        previousPresence,
        handlePresenceLeave
      );
      cerebellum.unsubscribeFromPresenceUpdates(
        previousPresence,
        handlePresenceUpdate
      );
    };
  }, [currentPresence]);

  const updatePresenceInfo = useCallback(
    (updatedUserInfo) => {
      userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
      cerebellum.updatePresenceInfo(currentPresence, userInfoRef.current);
    },
    [currentPresence]
  );

  return { presenceData, updatePresenceInfo };
};

export default usePresence;
