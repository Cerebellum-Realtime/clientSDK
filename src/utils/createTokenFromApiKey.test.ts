import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createTokenFromApiKey } from "./createTokenFromApiKey";
import { SignJWT } from "jose";
import { CerebellumOptions } from "../types";

// Mock the jose library
vi.mock("jose", () => {
  const mockSetProtectedHeader = vi.fn().mockReturnThis();
  const mockSetExpirationTime = vi.fn().mockReturnThis();
  const mockSign = vi.fn().mockResolvedValue("mocked-jwt-token");
  return {
    SignJWT: vi.fn(() => ({
      setProtectedHeader: mockSetProtectedHeader,
      setExpirationTime: mockSetExpirationTime,
      sign: mockSign,
    })),
  };
});

describe("createTokenFromApiKey", () => {
  let options: CerebellumOptions;

  beforeEach(() => {
    vi.clearAllMocks();
    options = {
      API_KEY: "test-api-key",
    };
  });

  it("should create a token when API_KEY is provided", async () => {
    await createTokenFromApiKey(options);

    expect(SignJWT).toHaveBeenCalledWith({});
    const signJWTInstance = (SignJWT as Mock).mock.results[0].value;
    expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledWith({
      alg: "HS256",
    });
    expect(signJWTInstance.setExpirationTime).toHaveBeenCalledWith("1m");
    expect(signJWTInstance.sign).toHaveBeenCalled();
    expect(options.auth).toEqual({ token: "mocked-jwt-token" });
  });

  it("should not create a token when API_KEY is not provided", async () => {
    delete options.API_KEY;

    await createTokenFromApiKey(options);

    expect(SignJWT).not.toHaveBeenCalled();
    expect(options.auth).toBeUndefined();
  });

  it("should use TextEncoder to encode the API_KEY", async () => {
    const mockEncode = vi.fn().mockReturnValue(new Uint8Array([1, 2, 3]));
    global.TextEncoder = vi.fn(() => ({ encode: mockEncode })) as any;

    await createTokenFromApiKey(options);

    expect(mockEncode).toHaveBeenCalledWith("test-api-key");
    const signJWTInstance = (SignJWT as Mock).mock.results[0].value;
    expect(signJWTInstance.sign).toHaveBeenCalledWith(
      new Uint8Array([1, 2, 3])
    );
  });

  it("should handle errors during token creation", async () => {
    const mockError = new Error("Token creation failed");
    (new SignJWT().sign as Mock).mockRejectedValue(mockError);

    await expect(createTokenFromApiKey(options)).rejects.toThrow(
      "Token creation failed"
    );
  });
});
