import { describe, it, expect, vi, beforeEach } from "vitest";
import { initializeConnection } from "./initializeConnection";
import { fetchSignedToken } from "./fetchSignedToken";
import { CerebellumOptions } from "../types";

// Mock the fetchSignedToken function
vi.mock("./fetchSignedToken", () => ({
  fetchSignedToken: vi.fn(),
}));

describe("initializeConnection", () => {
  const mockToken = "mock-token";
  let options: CerebellumOptions;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error to its original implementation
    vi.spyOn(console, "error").mockImplementation(() => {});

    options = {
      authRoute: {
        endpoint: "http://test-endpoint.com/auth",
        method: "POST",
        payload: { key: "value" },
      },
    };

    (fetchSignedToken as any).mockResolvedValue(mockToken);
  });

  it("should fetch a signed token and set it in options", async () => {
    await initializeConnection(options);

    expect(fetchSignedToken).toHaveBeenCalledWith(
      "http://test-endpoint.com/auth",
      "POST",
      { key: "value" }
    );
    expect(options.auth).toEqual({ token: mockToken });
    expect(options.autoConnect).toBe(true);
  });

  it("should throw an error if no auth route is provided", async () => {
    delete options.authRoute;

    await initializeConnection(options);

    expect(console.error).toHaveBeenCalledWith(
      "Error initializing connection: ",
      expect.any(Error)
    );
    expect(fetchSignedToken).not.toHaveBeenCalled();
  });

  it("should handle errors from fetchSignedToken", async () => {
    const mockError = new Error("Fetch error");
    (fetchSignedToken as any).mockRejectedValue(mockError);

    await initializeConnection(options);

    expect(console.error).toHaveBeenCalledWith(
      "Error initializing connection: ",
      mockError
    );
    expect(options.auth).toBeUndefined();
    expect(options.autoConnect).toBeUndefined();
  });

  it("should work with GET method", async () => {
    options.authRoute!.method = "GET";

    await initializeConnection(options);

    expect(fetchSignedToken).toHaveBeenCalledWith(
      "http://test-endpoint.com/auth",
      "GET",
      { key: "value" }
    );
  });

  it("should work with POST method", async () => {
    options.authRoute!.method = "POST";

    await initializeConnection(options);

    expect(fetchSignedToken).toHaveBeenCalledWith(
      "http://test-endpoint.com/auth",
      "POST",
      { key: "value" }
    );
  });
});
