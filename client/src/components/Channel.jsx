/* eslint-disable react/prop-types */
import { useState } from "react";

const Channel = ({ toggleJoinChannel }) => {
  const [channelNameField, setChannelNameField] = useState("");

  const handleJoinChannel = (event) => {
    event.preventDefault();
    const channelNameLower = channelNameField.toLowerCase();
    toggleJoinChannel(channelNameLower);
    setChannelNameField("");
  };

  return (
    <form className="join-channel" onSubmit={handleJoinChannel}>
      <input
        type="text"
        placeholder="Channel name"
        value={channelNameField}
        onChange={(e) => setChannelNameField(e.target.value)}
      />
      <button type="submit">Join</button>
    </form>
  );
};

export default Channel;
