import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CerebellumInit } from "./CerebellumInit";
import { io, Socket } from "socket.io-client";
import { fetchSignedToken } from "./utils/fetchSignedToken";
import { NewState, State } from "./types";

// Mock dependencies
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    off: vi.fn(),
    auth: {},
    id: "mockSocketId",
  })),
}));

vi.mock("./utils/fetchSignedToken", () => ({
  fetchSignedToken: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: vi.fn().mockImplementation(() => ({
    setExpirationTime: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue("mocked-jwt-token"),
  })),
}));

describe("CerebellumInit", () => {
  let cerebellum: CerebellumInit;
  let mockSocket: Socket;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      off: vi.fn(),
      id: "mockSocketId",
      auth: {},
    } as unknown as Socket;
    (io as unknown as Mock).mockReturnValue(mockSocket);
    // we use unknown for socket and io because we are not using all the properties/methods
    cerebellum = new CerebellumInit("http://localhost:8001", {});
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(io).toHaveBeenCalledWith("http://localhost:8001", {});
    });

    it("should have an id property of socketId is not set", () => {
      expect(cerebellum.socketId).toBe("socketId is not set yet");
    });

    it("should set socketId on connect", () => {
      const onMock = mockSocket.on as unknown as Mock;

      if (!onMock.mock) {
        throw new Error("onMock is not a mock");
      }

      const connectCall = onMock.mock.calls.find(
        (call) => call[0] === "connect"
      );

      if (!connectCall) {
        throw new Error("Connect handler was not registered");
      }

      const connectHandler = connectCall[1];

      if (typeof connectHandler !== "function") {
        throw new Error("Connect handler is not a function");
      }

      connectHandler();

      expect(cerebellum.socketId).toBe("mockSocketId");
    });
  });

  describe("on method", () => {
    it("should register an event listener for on event when on method is called", () => {
      const onMock = mockSocket.on as unknown as Mock;

      if (!onMock.mock) {
        throw new Error("onMock is not a mock");
      }

      cerebellum.on("eventName", () => {});

      expect(mockSocket.on).toHaveBeenCalledWith(
        "eventName",
        expect.any(Function)
      );
    });
  });

  describe("connect method", () => {
    it("should call socket.connect when connect is invoked", () => {
      cerebellum.connect();

      expect(mockSocket.connect).toHaveBeenCalled();
    });
  });

  describe("disconnect method", () => {
    it("should call socket.disconnect when disconnect is invoked", () => {
      cerebellum.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe("off method", () => {
    it("should call socket.off when off is invoked", () => {
      cerebellum.off("eventName", () => {});

      expect(mockSocket.off).toHaveBeenCalledWith(
        "eventName",
        expect.any(Function)
      );
    });
  });

  describe("auth method", () => {
    it("should set token on socket.auth when auth is invoked", async () => {
      const token = "mocked-jwt-token";

      (fetchSignedToken as Mock).mockResolvedValue(token);

      await cerebellum.auth("http://localhost:8001", "POST", {});

      if (
        typeof cerebellum.socket.auth === "object" &&
        cerebellum.socket.auth !== null
      ) {
        expect(cerebellum.socket.auth.token).toBe(token);
      } else {
        throw new Error("socket.auth is not set or is not an object");
      }
    });
  });

  describe("setToken method", () => {
    it("should set a token when setToken is invoked", () => {
      const token = "mocked-jwt-token";
      cerebellum.setToken(token);

      if (
        typeof cerebellum.socket.auth === "object" &&
        cerebellum.socket.auth !== null
      ) {
        expect(cerebellum.socket.auth.token).toBe(token);
      } else {
        throw new Error("socket.auth is not set or is not an object");
      }
    });
  });

  describe("createToken method", () => {
    it("should create a token when createToken is invoked", async () => {
      const apiKey = "mocked-api-key";
      const payload = { username: "user", password: "pass" };

      await cerebellum.createToken(apiKey, payload);

      if (
        typeof cerebellum.socket.auth === "object" &&
        cerebellum.socket.auth !== null
      ) {
        expect(cerebellum.socket.auth.token).toBe("mocked-jwt-token");
      } else {
        throw new Error("socket.auth is not set or is not an object");
      }
    });
  });

  describe("getPastMessages method", () => {
    it("should resolve with past messages on success", async () => {
      const mockPastMessages = [{ message: "mock-message" }];
      const mockLastEvaluatedKey = "mock-last-evaluated-key";

      (cerebellum.socket.emit as Mock).mockImplementation(
        (
          event,
          channelName,
          limit,
          sortDirection,
          lastEvaluatedKey,
          callback
        ) => {
          callback({
            success: true,
            pastMessages: mockPastMessages,
            lastEvaluatedKey: mockLastEvaluatedKey,
          });
        }
      );

      const result = await cerebellum.getPastMessages("testChannel", {
        limit: 10,
        sortDirection: "descending",
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:history",
        "testChannel",
        10,
        "descending",
        undefined,
        expect.any(Function)
      );

      expect(result).toEqual({
        messages: mockPastMessages,
        lastEvaluatedKey: mockLastEvaluatedKey,
      });
    });

    it("should reject with error message on failure", async () => {
      const mockErrorMessage = `Failed to get messages from testChannel`;

      (cerebellum.socket.emit as Mock).mockImplementation(
        (
          event,
          channelName,
          limit,
          sortDirection,
          lastEvaluatedKey,
          callback
        ) => {
          callback({
            success: false,
            error: mockErrorMessage,
          });
        }
      );

      await expect(
        cerebellum.getPastMessages("testChannel", {
          limit: 10,
          sortDirection: "descending",
        })
      ).rejects.toThrow(mockErrorMessage);
    });

    it("should use default values for limit and sortDirection if not provided", async () => {
      const mockPastMessages = [{ message: "mock-message" }];
      const mockLastEvaluatedKey = "mock-last-evaluated-key";

      (cerebellum.socket.emit as Mock).mockImplementation(
        (
          event,
          channelName,
          limit,
          sortDirection,
          lastEvaluatedKey,
          callback
        ) => {
          callback({
            success: true,
            pastMessages: mockPastMessages,
            lastEvaluatedKey: mockLastEvaluatedKey,
          });
        }
      );

      const result = await cerebellum.getPastMessages("testChannel");

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:history",
        "testChannel",
        50,
        "ascending",
        undefined,
        expect.any(Function)
      );

      expect(result).toEqual({
        messages: mockPastMessages,
        lastEvaluatedKey: mockLastEvaluatedKey,
      });
    });
  });

  describe("subscribeChannel", () => {
    it("should subscribe to a channel successfully", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, ackCallback) => {
          ackCallback({ success: true });
        }
      );

      cerebellum.subscribeChannel(channelName, callback);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:subscribe",
        channelName,
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        `message:receive:${channelName}`,
        callback
      );
    });

    it("should not set up listener if subscription fails", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, ackCallback) => {
          ackCallback({ success: false });
        }
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      cerebellum.subscribeChannel(channelName, callback);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:subscribe",
        channelName,
        expect.any(Function)
      );

      expect(mockSocket.on).not.toHaveBeenCalledWith(
        `message:receive:${channelName}`,
        callback
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to subscribe to channel ${channelName}`
      );

      consoleSpy.mockRestore();
    });
  });

  describe("unsubscribeChannel", () => {
    it("should unsubscribe from a channel successfully", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, ackCallback) => {
          ackCallback({ success: true });
        }
      );

      cerebellum.unsubscribeChannel(channelName, callback);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:unsubscribe",
        channelName,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        `message:receive:${channelName}`,
        callback
      );
    });

    it("should not remove listener if subscription fails", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, ackCallback) => {
          ackCallback({ success: false });
        }
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      cerebellum.unsubscribeChannel(channelName, callback);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "channel:unsubscribe",
        channelName,
        expect.any(Function)
      );
      expect(mockSocket.off).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to unsubscribe from channel ${channelName}`
      );

      consoleSpy.mockRestore();
    });
  });

  describe("publish", () => {
    it("should emit a message to the specified channel", () => {
      const channelName = "testChannel";
      const message = { text: "Hello, world!" };

      cerebellum.publish(channelName, message);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        message
      );
    });

    it("should work with different types of messages", () => {
      const channelName = "testChannel";

      cerebellum.publish(channelName, "string message");
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        "string message"
      );

      cerebellum.publish(channelName, 123);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        123
      );

      cerebellum.publish(channelName, { complex: { nested: "object" } });
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        { complex: { nested: "object" } }
      );

      cerebellum.publish(channelName, [1, 2, 3]);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        [1, 2, 3]
      );
    });

    it("should handle undefined or null messages", () => {
      const channelName = "testChannel";

      cerebellum.publish(channelName, undefined);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        undefined
      );

      cerebellum.publish(channelName, null);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "message:queue",
        channelName,
        null
      );
    });
  });
  describe("enterPresenceSet", () => {
    it("should emit presenceSet:enter event with channel name and state", () => {
      const channelName = "testChannel";
      const state: NewState = { userId: "123", status: "online" };

      cerebellum.enterPresenceSet(channelName, state);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "presenceSet:enter",
        channelName,
        state
      );
    });
  });

  describe("leavePresenceSet", () => {
    it("should emit presenceSet:leave event with channel name", () => {
      const channelName = "testChannel";

      cerebellum.leavePresenceSet(channelName);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "presenceSet:leave",
        channelName
      );
    });
  });

  describe("getPresenceSetMembers", () => {
    it("should resolve with users when successful", async () => {
      const channelName = "testChannel";
      const mockUsers: State[] = [
        { userId: "123", status: "online", socketId: "1" },
        { userId: "456", status: "away", socketId: "2" },
      ];

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, callback) => {
          callback({ success: true, users: mockUsers });
        }
      );

      const result = await cerebellum.getPresenceSetMembers(channelName);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "presence:members:get",
        channelName,
        expect.any(Function)
      );
      expect(result).toEqual(mockUsers);
    });

    it("should reject with an error when unsuccessful", async () => {
      const channelName = "testChannel";

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, callback) => {
          callback({ success: false });
        }
      );

      await expect(
        cerebellum.getPresenceSetMembers(channelName)
      ).rejects.toThrow(`Failed to subscribe to presence set ${channelName}`);
    });

    it("should reject with an error when users are undefined", async () => {
      const channelName = "testChannel";

      (mockSocket.emit as Mock).mockImplementation(
        (event, channel, callback) => {
          callback({ success: true, users: undefined });
        }
      );

      await expect(
        cerebellum.getPresenceSetMembers(channelName)
      ).rejects.toThrow(`Failed to subscribe to presence set ${channelName}`);
    });
  });

  describe("subscribeToPresenceJoins", () => {
    it("should subscribe to the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.subscribeToPresenceJoins(channelName, callback);

      expect(mockSocket.on).toHaveBeenCalledWith(
        `presence:${channelName}:join`,
        callback
      );
    });
  });

  describe("subscribeToPresenceUpdates", () => {
    it("should subscribe to the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.subscribeToPresenceUpdates(channelName, callback);

      expect(mockSocket.on).toHaveBeenCalledWith(
        `presence:${channelName}:update`,
        callback
      );
    });
  });

  describe("subscribeToPresenceLeaves", () => {
    it("should subscribe to the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.subscribeToPresenceLeaves(channelName, callback);

      expect(mockSocket.on).toHaveBeenCalledWith(
        `presence:${channelName}:leave`,
        callback
      );
    });
  });

  describe("unsubscribeFromPresenceLeaves", () => {
    it("should unsubscribe from the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.unsubscribeFromPresenceLeaves(channelName, callback);

      expect(mockSocket.off).toHaveBeenCalledWith(
        `presence:${channelName}:leave`,
        callback
      );
    });
  });

  describe("unsubscribeFromPresenceJoins", () => {
    it("should unsubscribe from the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.unsubscribeFromPresenceJoins(channelName, callback);

      expect(mockSocket.off).toHaveBeenCalledWith(
        `presence:${channelName}:join`,
        callback
      );
    });
  });

  describe("unsubscribeFromPresenceUpdates", () => {
    it("should unsubscribe from the correct event", () => {
      const channelName = "testChannel";
      const callback = vi.fn();

      cerebellum.unsubscribeFromPresenceUpdates(channelName, callback);

      expect(mockSocket.off).toHaveBeenCalledWith(
        `presence:${channelName}:update`,
        callback
      );
    });
  });

  describe("updatePresenceInfo", () => {
    it("should emit the correct event with channel name and state", () => {
      const channelName = "testChannel";
      const state = { status: "online" };

      cerebellum.updatePresenceInfo(channelName, state);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "presence:update",
        channelName,
        state
      );
    });
  });

  describe("getSocket", () => {
    it("should return the socket object", () => {
      const socket = cerebellum.getSocket();

      expect(socket).toBe(mockSocket);
    });
  });
});
