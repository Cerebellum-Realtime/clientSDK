/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import usePresence from "../customHooks/usePresence";
import TypingIndicator from "./TypingIndicator";

const SendMessageForm = ({ user, publish }) => {
  const [messageField, setMessageField] = useState("");
  const typingTimeoutRef = useRef(null);
  const { presenceData, updatePresenceInfo } = usePresence("typing", {
    user,
    typing: false,
  });

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    updatePresenceInfo({ user });
  }, [user, updatePresenceInfo]);

  useEffect(() => {}, [presenceData]);

  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${messageField}`;
    publish(messageSend);
    setMessageField("");
    updatePresenceInfo({ typing: false });
  };

  const handleOnChange = (e) => {
    setMessageField(e.target.value);
    updatePresenceInfo({ typing: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updatePresenceInfo({ typing: false });
    }, 1000);
  };

  return (
    <div>
      <h3>Send directly to DynamoDB</h3>
      <form className="send" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message direct to DB"
          value={messageField}
          onChange={handleOnChange}
        />
        <button type="submit">Send</button>
      </form>
      <TypingIndicator presenceData={presenceData} />
    </div>
  );
};

export default SendMessageForm;
