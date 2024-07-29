import { SignJWT } from "jose";
import { CerebellumOptions } from "../types";

/**
 * The function `createTokenFromApiKey` generates a JWT token using an API key provided in the
 * `options` object.
 * @param {CerebellumOptions} options - The `options` parameter in the `createTokenFromApiKey` function
 * is of type `CerebellumOptions`. It seems to contain an `API_KEY` property that is used to create a
 * token. The function encodes the API key, sets it as a token in the `auth`
 */
export const createTokenFromApiKey = async (options: CerebellumOptions) => {
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
