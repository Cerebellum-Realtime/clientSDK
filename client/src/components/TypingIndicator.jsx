/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const TypingIndicator = ({ presenceData }) => {
  const [typingUsers, setTypingUsers] = useState("");

  useEffect(() => {
    const newTypingUsers = presenceData
      .filter((presence) => presence.typing === "true")
      .map((presence) => presence.user);

    let typingString = "";
    const len = newTypingUsers.length;

    switch (len) {
      case 0:
        typingString = "";
        break;
      case 1:
        typingString = `${newTypingUsers[0]} is typing`;
        break;
      case 2:
        typingString = `${newTypingUsers[0]} and ${newTypingUsers[1]} are typing`;
        break;
      case 3:
        typingString = `${newTypingUsers.slice(0, -1).join(", ")} and ${
          newTypingUsers[len - 1]
        } are typing`;
        break;
      default:
        typingString = "Multiple people are typing";
        break;
    }

    setTypingUsers(typingString);
  }, [presenceData]);

  return (
    <>
      {typingUsers && (
        <div>
          <p>{typingUsers}</p>
        </div>
      )}
    </>
  );
};

export default TypingIndicator;
