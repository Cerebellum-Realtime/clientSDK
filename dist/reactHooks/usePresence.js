import { useEffect, useState, useRef, useCallback } from "react";
export const usePresence = (cerebellum, channelName, initialUserInfo) => {
    const [currentPresence] = useState(channelName);
    const [presenceData, setPresenceData] = useState([]);
    const userInfoRef = useRef(initialUserInfo);
    const previousPresenceRef = useRef(channelName);
    useEffect(() => {
        if (!currentPresence) {
            return;
        }
        const previousPresence = previousPresenceRef.current;
        const handlePresenceLeave = (response) => {
            setPresenceData((prevData) => prevData.filter((data) => data.socketId !== response.socketId));
        };
        const handlePresenceJoin = (response) => {
            setPresenceData((prevData) => [...prevData, response]);
        };
        const handlePresenceUpdate = (response) => {
            setPresenceData((prevData) => prevData.map((data) => data.socketId === response.socketId ? response : data));
        };
        const handleSocketConnect = async () => {
            const presenceUsers = await cerebellum.getPresenceSetMembers(currentPresence);
            setPresenceData(presenceUsers);
            cerebellum.enterPresenceSet(currentPresence, userInfoRef.current);
        };
        cerebellum.subscribeToPresenceJoins(currentPresence, handlePresenceJoin);
        cerebellum.subscribeToPresenceUpdates(currentPresence, handlePresenceUpdate);
        cerebellum.subscribeToPresenceLeaves(currentPresence, handlePresenceLeave);
        handleSocketConnect();
        cerebellum.on("connect", handleSocketConnect);
        return () => {
            if (previousPresence) {
                cerebellum.leavePresenceSet(previousPresence);
                cerebellum.off("connect", handleSocketConnect);
                cerebellum.unsubscribeFromPresenceJoins(previousPresence, handlePresenceJoin);
                cerebellum.unsubscribeFromPresenceLeaves(previousPresence, handlePresenceLeave);
                cerebellum.unsubscribeFromPresenceUpdates(previousPresence, handlePresenceUpdate);
            }
        };
    }, [currentPresence]);
    const updatePresenceInfo = useCallback((updatedUserInfo) => {
        userInfoRef.current = { ...userInfoRef.current, ...updatedUserInfo };
        if (currentPresence) {
            cerebellum.updatePresenceInfo(currentPresence, userInfoRef.current);
        }
        else {
            console.error("No presence channel selected");
        }
    }, [currentPresence]);
    return { presenceData, updatePresenceInfo };
};
export default usePresence;
//# sourceMappingURL=usePresence.js.map