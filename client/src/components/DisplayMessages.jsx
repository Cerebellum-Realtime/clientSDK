/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
const DisplayMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function getCurrentTimeFormatted(createdAt) {
    const date = new Date(createdAt);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleTimeString([], options);
  }

  return (
    <ul>
      {messages.map((message, index) => (
        <li key={index}>
          {getCurrentTimeFormatted(message.createdAt)}: {message.content}
        </li>
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );
};

export default DisplayMessages;
