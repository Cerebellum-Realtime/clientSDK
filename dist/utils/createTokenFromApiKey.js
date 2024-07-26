import { SignJWT } from "jose";
export const createTokenFromApiKey = async (options) => {
    const textEncode = new TextEncoder().encode(options.API_KEY);
    const apiKey = options.API_KEY;
    if (apiKey) {
        options.auth = {};
        options.auth.token = await new SignJWT({})
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1m")
            .sign(textEncode);
    }
};
//# sourceMappingURL=createTokenFromApiKey.js.map