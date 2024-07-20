/* eslint-disable react/prop-types */
import { useState } from "react";

const ChangeUserName = ({ user, toggleChangeUser }) => {
  const [userNameField, setUserNameField] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();
    toggleChangeUser(userNameField);
    setUserNameField("");
  };

  return (
    <div>
      <h3>New UserName</h3>
      <form className="send" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder={user}
          value={userNameField}
          onChange={(e) => setUserNameField(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ChangeUserName;
