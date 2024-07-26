import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { State } from "../../types.js";
import { CerebellumInit } from "../../CerebellumInit.js";
import { useCerebellum } from "./useCerebellum.js";

/**
 * The `usePresence` function in TypeScript manages presence data for a given channel using cerebellum
 *  and provides methods to update presence information.
 * @param {string} channelName - The `channelName` parameter is a string that represents the name of
 * the channel for which presence information is being tracked.
 * @param {State} initialUserInfo - The `initialUserInfo` parameter in the `usePresence` function
 * represents the initial user information that will be used when connecting to a presence channel.
 * This information could include details about the user such as their username, ID, status, etc. It
 * serves as the starting point for the user's presence data
 * @returns The `usePresence` custom hook is returning an object with two properties:
 * 1. `presenceData`: An array of `State` objects representing the current presence data.
 * 2. `updatePresenceInfo`: A function that allows updating the presence information by passing in a
 * new `State` object.
 */
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

  /**
   * The `updatePresenceInfo` function in TypeScript allows updating the presence information for the
   * current presence channel.
   * @param {State} updatedUserInfo - The `updatedUserInfo` parameter is a `State` object that
   * represents the updated presence information for the current presence channel. This information
   * could include details such as the user's status, activity, or any other relevant data.
   * @returns The `updatePresenceInfo` function returns a Promise that resolves when the presence
   * information is updated.
   */
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
