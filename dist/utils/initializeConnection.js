import { fetchSignedToken } from "./fetchSignedToken";
export const initializeConnection = async (options) => {
    try {
        if (!options.authRoute)
            throw new Error("No auth route provided");
        const { endpoint, method, payload } = options.authRoute;
        const token = await fetchSignedToken(endpoint, method, payload);
        options.auth = {};
        options.auth.token = token;
        options.autoConnect = true;
    }
    catch (error) {
        console.error("Error initializing connection: ", error);
    }
};
//# sourceMappingURL=initializeConnection.js.map