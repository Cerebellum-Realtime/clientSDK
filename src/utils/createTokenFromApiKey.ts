import { SignJWT } from "jose";
import { CerebellumOptions } from "../types";

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
