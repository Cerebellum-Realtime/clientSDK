import { CerebellumOptions } from "../types";
/**
 * The function `createTokenFromApiKey` generates a JWT token using an API key provided in the
 * `options` object.
 * @param {CerebellumOptions} options - The `options` parameter in the `createTokenFromApiKey` function
 * is of type `CerebellumOptions`. It seems to contain an `API_KEY` property that is used to create a
 * token. The function encodes the API key, sets it as a token in the `auth`
 */
export declare const createTokenFromApiKey: (options: CerebellumOptions) => Promise<void>;
