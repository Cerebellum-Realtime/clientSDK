import { NewState, State } from "../../types.js";
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
export declare const usePresence: (channelName: string, initialUserInfo: NewState) => {
    presenceData: State[];
    updatePresenceInfo: (updatedUserInfo: NewState) => void;
};
export default usePresence;
