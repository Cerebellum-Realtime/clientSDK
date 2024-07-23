import { CerebellumOptions } from "../types";
import { fetchSignedToken } from "./fetchSignedToken";

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
