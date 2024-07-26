import { useEffect, useRef, useCallback, useMemo } from "react";
import { useCerebellum } from "./useCerebellum.js";
export const useChannel = (channelName, onMessage) => {
    const onMessageRef = useRef(onMessage);
    const channelNameRef = useRef(channelName);
    const cerebellum = useCerebellum();
    useEffect(() => {
        onMessageRef.current = onMessage;
        channelNameRef.current = channelName;
    }, [onMessage, channelName]);
    useEffect(() => {
        const currentChannelName = channelNameRef.current;
        const handleMessage = (message) => {
            onMessageRef.current && onMessageRef.current(message);
        };
        cerebellum.subscribeChannel(currentChannelName, handleMessage);
        return () => {
            cerebellum.unsubscribeChannel(currentChannelName, handleMessage);
        };
    }, [cerebellum]);
    const publish = useCallback((message) => {
        cerebellum.publish(channelNameRef.current, message);
    }, [cerebellum]);
    return useMemo(() => ({
        channelName: channelNameRef.current,
        publish,
    }), [publish]);
};
export default useChannel;
//# sourceMappingURL=useChannel.js.map