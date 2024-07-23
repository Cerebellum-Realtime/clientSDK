import { CerebellumOptions, Message, getPastMessagesOptions, PastMessages, Payload, State } from "./types";
import { Socket } from "socket.io-client";
export declare class CerebellumInit {
    socket: Socket;
    constructor(endpoint: string, options: CerebellumOptions);
    init(): void;
    on(event: string, callback: (...args: any) => any): void;
    authErrorCallback(callback: (...args: any) => any): void;
    addAuthErrorListener(): void;
    connect(): void;
    disconnect(): void;
    off(event: string, callback: (...args: any) => any): void;
    auth(authEndpoint: string, method: ("GET" | "POST") | undefined, payload: Payload): Promise<void>;
    getPastMessages(channelName: string, { limit, sortDirection, lastEvaluatedKey, }?: getPastMessagesOptions): Promise<PastMessages>;
    subscribeChannel(channelName: string, callback: (pastMessages: Message[]) => any): void;
    unsubscribeChannel(channelName: string, callback: (messages: Message[]) => any): void;
    publish(channelName: string, message: string): void;
    enterPresenceSet(channelName: string, state: State): void;
    leavePresenceSet(channelName: string): void;
    getPresenceSetMembers(channelName: string): Promise<State[]>;
    subscribeToPresenceJoins(channelName: string, callback: (state: State) => any): void;
    subscribeToPresenceUpdates(channelName: string, callback: (state: State) => any): void;
    subscribeToPresenceLeaves(channelName: string, callback: (state: State) => any): void;
    unsubscribeFromPresenceLeaves(channelName: string, callback: (state: State) => any): void;
    unsubscribeFromPresenceJoins(channelName: string, callback: (state: State) => any): void;
    unsubscribeFromPresenceUpdates(channelName: string, callback: (state: State) => any): void;
    updatePresenceInfo(channelName: string, state: State): void;
    getSocket(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
}