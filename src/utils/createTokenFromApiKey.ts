import jwt from "jsonwebtoken";
import { CerebellumOptions } from "../types";

export const createTokenFromApiKey = (options: CerebellumOptions) => {
  const apiKey = options.API_KEY;
  if (apiKey) {
    options.auth = {};
    options.auth.token = jwt.sign({}, apiKey, { expiresIn: "1m" });
  }
};
