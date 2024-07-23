import axios from "axios";
export const fetchSignedToken = async (authRoute, authMethod = "POST", payload) => {
    try {
        const actualPayload = payload === undefined ? {} : payload;
        const { data } = authMethod === "GET"
            ? await axios.get(authRoute)
            : await axios.post(authRoute, actualPayload);
        return data;
    }
    catch (error) {
        console.error("Error fetching token: ", error);
        throw error;
    }
};
//# sourceMappingURL=fetchSignedToken.js.map