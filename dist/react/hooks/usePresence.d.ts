import { State } from "../../types.js";
export declare const usePresence: (channelName: string, initialUserInfo: State) => {
    presenceData: State[];
    updatePresenceInfo: (updatedUserInfo: State) => void;
};
export default usePresence;
