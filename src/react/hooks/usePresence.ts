import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { State } from "../../types.js";
import { CerebellumInit } from "../../CerebellumInit.js";
import { useCerebellum } from "./useCerebellum.js";

export const usePresence = (channelName: string, initialUserInfo: State) => {
  const currentPresenceRef = useRef<string | null>(channelName);
  const [presenceData, setPresenceData] = useState<State[]>([]);
  const userInfoRef = useRef<State>(initialUserInfo);
  const cerebellum: CerebellumInit = useCerebellum();

  const handlePresenceLeave = useCallback((response: State) => {
    setPresenceData((prevData) =>
      prevData.filter((data) => data.socketId !== response.socketId)
    );
  }, []);

  const handlePresenceJoin = useCallback((response: State) => {
    setPresenceData((prevData) => [...prevData, response]);
  }, []);

  const handlePresenceUpdate = useCallback((response: State) => {
    setPresenceData((prevData) =>
      prevData.map((data) =>
        data.socketId === response.socketId ? response : data
      )
    );
  }, []);

  useEffect(() => {
    if (currentPresenceRef.current === null) {
      return;
    }
    const currentChannel = currentPresenceRef.current;
    const handleSocketConnect = async () => {
      const presenceUsers = await cerebellum.getPresenceSetMembers(
        currentChannel
      );
      setPresenceData(presenceUsers);
      cerebellum.enterPresenceSet(currentChannel, userInfoRef.current);
    };

    cerebellum.subscribeToPresenceJoins(currentChannel, handlePresenceJoin);
    cerebellum.subscribeToPresenceUpdates(currentChannel, handlePresenceUpdate);
    cerebellum.subscribeToPresenceLeaves(currentChannel, handlePresenceLeave);

    handleSocketConnect();
    cerebellum.on("reconnect", handleSocketConnect);

    return () => {
      if (currentChannel) {
        cerebellum.leavePresenceSet(currentChannel);
        cerebellum.off("reconnect", handleSocketConnect);
        cerebellum.unsubscribeFromPresenceJoins(
          currentChannel,
          handlePresenceJoin
        );
        cerebellum.unsubscribeFromPresenceLeaves(
          currentChannel,
          handlePresenceLeave
        );
        cerebellum.unsubscribeFromPresenceUpdates(
          currentChannel,
          handlePresenceUpdate
        );
      }
    };
  }, [
    cerebellum,
    handlePresenceJoin,
    handlePresenceUpdate,
    handlePresenceLeave,
  ]);

  const updatePresenceInfo = useCallback(
    (updatedUserInfo: State) => {
      userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
      const currentPresence = currentPresenceRef.current;
      if (currentPresence) {
        cerebellum.updatePresenceInfo(currentPresence, userInfoRef.current);
      } else {
        console.error("No presence channel selected");
      }
    },
    [cerebellum]
  );

  return useMemo(
    () => ({
      presenceData,
      updatePresenceInfo,
    }),
    [presenceData, updatePresenceInfo]
  );
};

export default usePresence;
