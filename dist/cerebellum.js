import { CerebellumInit } from "./CerebellumInit";
import { initializeConnection } from "./utils/initializeConnection";
export const Cerebellum = async (endpoint, options) => {
    options.auth = {};
    if (options.hasOwnProperty("autoConnect") && options.autoConnect === false) {
        return new CerebellumInit(endpoint, options);
    }
    else {
        await initializeConnection(options);
        return new CerebellumInit(endpoint, options);
    }
};
export default Cerebellum;
//# sourceMappingURL=cerebellum.js.map