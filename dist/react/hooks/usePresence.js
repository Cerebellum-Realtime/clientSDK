import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useCerebellum } from "./useCerebellum.js";
export const usePresence = (channelName, initialUserInfo) => {
    const currentPresenceRef = useRef(channelName);
    const [presenceData, setPresenceData] = useState([]);
    const userInfoRef = useRef(initialUserInfo);
    const cerebellum = useCerebellum();
    const handlePresenceLeave = useCallback((response) => {
        setPresenceData((prevData) => prevData.filter((data) => data.socketId !== response.socketId));
    }, []);
    const handlePresenceJoin = useCallback((response) => {
        setPresenceData((prevData) => [...prevData, response]);
    }, []);
    const handlePresenceUpdate = useCallback((response) => {
        setPresenceData((prevData) => prevData.map((data) => data.socketId === response.socketId ? response : data));
    }, []);
    useEffect(() => {
        if (currentPresenceRef.current === null) {
            return;
        }
        const currentChannel = currentPresenceRef.current;
        const handleSocketConnect = async () => {
            const presenceUsers = await cerebellum.getPresenceSetMembers(currentChannel);
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
                cerebellum.unsubscribeFromPresenceJoins(currentChannel, handlePresenceJoin);
                cerebellum.unsubscribeFromPresenceLeaves(currentChannel, handlePresenceLeave);
                cerebellum.unsubscribeFromPresenceUpdates(currentChannel, handlePresenceUpdate);
            }
        };
    }, [
        cerebellum,
        handlePresenceJoin,
        handlePresenceUpdate,
        handlePresenceLeave,
    ]);
    const updatePresenceInfo = useCallback((updatedUserInfo) => {
        userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
        const currentPresence = currentPresenceRef.current;
        if (currentPresence) {
            cerebellum.updatePresenceInfo(currentPresence, userInfoRef.current);
        }
        else {
            console.error("No presence channel selected");
        }
    }, [cerebellum]);
    return useMemo(() => ({
        presenceData,
        updatePresenceInfo,
    }), [presenceData, updatePresenceInfo]);
};
export default usePresence;
//# sourceMappingURL=usePresence.js.map