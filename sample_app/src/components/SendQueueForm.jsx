/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import TypingIndicator from "./TypingIndicator";
import usePresence from "../customHooks/usePresence";

const SendQueueForm = ({ user, queue }) => {
  const [queueField, setQueueField] = useState("");
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

  useEffect(() => {}, [presenceData]);
  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${queueField}`;
    queue(messageSend);
    setQueueField("");
    updatePresenceInfo({ typing: false });
  };

  const handleOnChange = (e) => {
    setQueueField(e.target.value);
    updatePresenceInfo({ typing: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updatePresenceInfo({ typing: false });
    }, 1000);
  };

  return (
    <div className="queue">
      <h3>Send thru Queue</h3>
      <form className="send" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message thru Queue"
          value={queueField}
          onChange={handleOnChange}
        />
        <button type="submit">Send</button>
      </form>
      <TypingIndicator presenceData={presenceData} />
    </div>
  );
};

export default SendQueueForm;
