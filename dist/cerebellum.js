import { CerebellumInit } from "./CerebellumInit.js";
import { initializeConnection } from "./utils/initializeConnection.js";
import { createTokenFromApiKey } from "./utils/createTokenFromApiKey.js";
/**
 * The Cerebellum function in TypeScript initializes a connection to an endpoint with specified
 * options, including handling API key authentication and auto-connect functionality.
 * @param {string} endpoint - The `endpoint` parameter is a string that represents the URL or address
 * of the Cerebellum service that the function will interact with.
 * @param {CerebellumOptions} options - The `options` parameter in the `Cerebellum` function is an
 * object that contains configuration options for the Cerebellum service. It includes properties such
 * as `auth`, `API_KEY`, and `autoConnect`. The function modifies the `options` object by setting
 * `auth` to
 * @returns The `Cerebellum` function is being exported as the default export. This function takes in
 * an `endpoint` string and `options` object as parameters. It initializes a connection to the
 * Cerebellum service using the provided `endpoint` and `options`. The function also modifies the `options`
 * object by setting `auth` to an empty object if the `API_KEY` property is present in the `options`
 * object.
 */
export const Cerebellum = async (endpoint, options) => {
    options.auth = {};
    if (options.hasOwnProperty("API_KEY")) {
        createTokenFromApiKey(options);
        return new CerebellumInit(endpoint, options);
    }
    if (options.hasOwnProperty("autoConnect") && options.autoConnect === true) {
        await initializeConnection(options);
    }
    return new CerebellumInit(endpoint, options);
};
export default Cerebellum;
//# sourceMappingURL=cerebellum.js.map