import { Payload } from "../types";
import axios from "axios";

/**
 * The `fetchSignedToken` function asynchronously fetches a signed token using either a POST or GET
 * request with optional payload.
 * @param {string} authRoute - The `authRoute` parameter is a string that represents the route or URL
 * where the authentication request will be sent to in order to fetch a signed token.
 * @param {"POST" | "GET"} [authMethod=POST] - The `authMethod` parameter in the `fetchSignedToken`
 * function specifies the HTTP method to be used for the authentication request. It can be either
 * "POST" or "GET". If not provided, the default method is set to "POST".
 * @param {Payload} [payload] - The `payload` parameter in the `fetchSignedToken` function is an
 * optional parameter that represents the data to be sent along with the request. It is of type
 * `Payload`, which means it can be any type defined as `Payload`. If no payload is provided when
 * calling the function, it defaults
 * @returns The `fetchSignedToken` function returns the data fetched from the specified `authRoute`
 * using either a POST or GET request based on the `authMethod` parameter. If the request is
 * successful, it returns the fetched data. If there is an error during the fetch, it logs the error
 * and throws it.
 */
export const fetchSignedToken = async (
  authRoute: string,
  authMethod: "POST" | "GET" = "POST",
  payload?: Payload
) => {
  try {
    const actualPayload = payload === undefined ? {} : payload;

    const { data } =
      authMethod === "GET"
        ? await axios.get(authRoute)
        : await axios.post(authRoute, actualPayload);
    return data;
  } catch (error) {
    console.error("Error fetching token: ", error);
    throw error;
  }
};
