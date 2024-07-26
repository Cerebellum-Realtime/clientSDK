import { CerebellumOptions } from "../types";
import { fetchSignedToken } from "./fetchSignedToken";

/**
 * The function `initializeConnection` in TypeScript initializes a connection by fetching a signed
 * token using provided options.
 * @param {CerebellumOptions} options - CerebellumOptions {
 */
export const initializeConnection = async (options: CerebellumOptions) => {
  try {
    if (!options.authRoute) throw new Error("No auth route provided");
    const { endpoint, method, payload } = options.authRoute;
    const token: string = await fetchSignedToken(endpoint, method, payload);

    options.auth = {};
    options.auth.token = token;
    options.autoConnect = true;
  } catch (error) {
    console.error("Error initializing connection: ", error);
  }
};
