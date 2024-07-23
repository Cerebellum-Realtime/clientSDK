import { State } from "../types";
import { CerebellumInit } from "../CerebellumInit";
export declare const usePresence: (cerebellum: CerebellumInit, channelName: string, initialUserInfo: State) => {
    presenceData: State[];
    updatePresenceInfo: (updatedUserInfo: State) => void;
};
export default usePresence;
