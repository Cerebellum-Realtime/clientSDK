import { CerebellumInit } from "./CerebellumInit.js";
import { initializeConnection } from "./utils/initializeConnection.js";
import { createTokenFromApiKey } from "./utils/createTokenFromApiKey.js";
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