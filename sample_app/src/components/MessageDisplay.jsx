/* eslint-disable react/prop-types */
import { useState } from "react";
import DisplayMessages from "./DisplayMessages";
import SendQueueForm from "./SendQueueForm";
import useChannel from "../customHooks/useChannel";
import ChangeUserName from "./ChangeUserName";
import OnlineUserPresence from "./OnlineUserPresence";
import usePresence from "../customHooks/usePresence";

const MessageDisplay = ({
  currentChannel,
  user,
  toggleLeaveChannel,
  toggleChangeUser,
}) => {
  const [messages, setMessages] = useState([]);
  const { presenceData, updatePresenceInfo } = usePresence(currentChannel, {
    user,
  });

  const { publish } = useChannel(currentChannel, (message) => {
    setMessages((prevMessages) => prevMessages.concat(message));
  });
  const handleLeaveChannel = (event) => {
    event.preventDefault();
    setMessages([]);
    toggleLeaveChannel();
  };

  const handleChangeUser = (newUserName) => {
    toggleChangeUser(newUserName);
    updatePresenceInfo({ user: newUserName });
  };

  return (
    <>
      <div className="message-display">
        <div>
          <div className="channel-info-container">
            <p className="channel-info">Current Channel: {currentChannel}</p>
            <form onSubmit={handleLeaveChannel}>
              <button type="submit">Leave</button>
            </form>
          </div>
          <></>
          <DisplayMessages messages={messages} />
          <SendQueueForm user={user} queue={publish} />
          <ChangeUserName user={user} toggleChangeUser={handleChangeUser} />
        </div>
        <OnlineUserPresence presenceData={presenceData} />
      </div>
    </>
  );
};

export default MessageDisplay;
