import { describe, it, expect, vi, beforeEach } from "vitest";
import { Cerebellum } from "./cerebellum";
import { CerebellumInit } from "./CerebellumInit";
import { initializeConnection } from "./utils/initializeConnection";
import { createTokenFromApiKey } from "./utils/createTokenFromApiKey";

vi.mock("./CerebellumInit");
vi.mock("./utils/initializeConnection");
vi.mock("./utils/createTokenFromApiKey");

describe("Cerebellum", () => {
  const mockEndpoint = "http://test-endpoint.com";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with API_KEY", async () => {
    const options = { API_KEY: "test-api-key" };

    await Cerebellum(mockEndpoint, options);

    expect(createTokenFromApiKey).toHaveBeenCalledWith(options);
    expect(CerebellumInit).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        auth: {},
        API_KEY: "test-api-key",
      })
    );
  });

  it("should initialize with autoConnect", async () => {
    const options = { autoConnect: true };

    await Cerebellum(mockEndpoint, options);

    expect(initializeConnection).toHaveBeenCalledWith(options);
    expect(CerebellumInit).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        auth: {},
        autoConnect: true,
      })
    );
  });

  it("should initialize without API_KEY or autoConnect", async () => {
    const options = {};

    await Cerebellum(mockEndpoint, options);

    expect(createTokenFromApiKey).not.toHaveBeenCalled();
    expect(initializeConnection).not.toHaveBeenCalled();
    expect(CerebellumInit).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        auth: {},
      })
    );
  });

  it("should return a CerebellumInit instance", async () => {
    const options = {};
    const result = await Cerebellum(mockEndpoint, options);

    expect(result).toBeInstanceOf(CerebellumInit);
  });
});
