import { describe, it, expect, vi, Mock } from "vitest";
import axios from "axios";
import { fetchSignedToken } from "./fetchSignedToken";
import { Payload } from "../types";

vi.mock("axios");

describe("fetchSignedToken", () => {
  it("should fetch data with POST method by default", async () => {
    const mockData = { token: "abc123" };
    const mockAuthRoute = "/auth";
    const mockPayload: Payload = { username: "user", password: "pass" };

    (axios.post as Mock).mockResolvedValue({ data: mockData });

    const result = await fetchSignedToken(mockAuthRoute, "POST", mockPayload);

    expect(axios.post).toHaveBeenCalledWith(mockAuthRoute, mockPayload);
    expect(result).toEqual(mockData);
  });

  it("should fetch data with GET method", async () => {
    const mockData = { token: "abc123" };
    const mockAuthRoute = "/auth";

    (axios.get as Mock).mockResolvedValue({ data: mockData });

    const result = await fetchSignedToken(mockAuthRoute, "GET");

    expect(axios.get).toHaveBeenCalledWith(mockAuthRoute);
    expect(result).toEqual(mockData);
  });

  it("should use an empty object as payload if payload is undefined", async () => {
    const mockData = { token: "abc123" };
    const mockAuthRoute = "/auth";

    (axios.post as Mock).mockResolvedValue({ data: mockData });

    const result = await fetchSignedToken(mockAuthRoute);

    expect(axios.post).toHaveBeenCalledWith(mockAuthRoute, {});
    expect(result).toEqual(mockData);
  });

  it("should throw an error if the request fails", async () => {
    const mockError = new Error("Network Error");
    const mockAuthRoute = "/auth";
    const mockPayload: Payload = { username: "user", password: "pass" };

    (axios.post as Mock).mockRejectedValue(mockError);

    await expect(
      fetchSignedToken(mockAuthRoute, "POST", mockPayload)
    ).rejects.toThrow("Network Error");

    expect(axios.post).toHaveBeenCalledWith(mockAuthRoute, mockPayload);
  });
});
