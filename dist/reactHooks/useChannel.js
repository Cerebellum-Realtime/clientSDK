import { useEffect, useState, useRef, useCallback } from "react";
export const useChannel = (cerebellum, channelName, callback) => {
    const callbackRef = useRef(callback);
    const [currentChannel, setCurrentChannel] = useState(channelName);
    const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState(undefined);
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
        const fetchMessages = async () => {
            const { messages, lastEvaluatedKey } = await cerebellum.getPastMessages(currentChannel);
            setCurrentLastEvaluatedKey(lastEvaluatedKey);
            handleMessageReceive(messages);
            cerebellum.subscribeChannel(currentChannel, handleMessageReceive);
        };
        fetchMessages();
        return () => {
            cerebellum.unsubscribeChannel(previousChannel, handleMessageReceive);
        };
    }, [currentChannel]);
    const publish = useCallback((messageData) => {
        if (currentChannel) {
            cerebellum.publish(currentChannel, messageData);
        }
    }, [currentChannel]);
    const subscribe = (newChannel) => {
        setCurrentChannel(newChannel);
    };
    const unsubscribe = () => {
        setCurrentChannel(null);
    };
    const getPastMessages = async (limit = 50, sortDirection = "ascending") => {
        if (!currentChannel)
            throw new Error("No channel selected");
        try {
            return await cerebellum.getPastMessages(currentChannel, {
                limit,
                sortDirection,
                lastEvaluatedKey: currentLastEvaluatedKey,
            });
        }
        catch (error) {
            console.error(error);
        }
    };
    return { publish, subscribe, unsubscribe, getPastMessages };
};
export default useChannel;
//# sourceMappingURL=useChannel.js.map