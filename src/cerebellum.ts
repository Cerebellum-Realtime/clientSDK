import { CerebellumOptions } from "./types";
import { CerebellumInit } from "./CerebellumInit";
import { initializeConnection } from "./utils/initializeConnection";
import { createTokenFromApiKey } from "./utils/createTokenFromApiKey";

export const Cerebellum = async (
  endpoint: string,
  options: CerebellumOptions
) => {
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
