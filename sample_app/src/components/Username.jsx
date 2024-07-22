import { useState } from "react";
import { cerebellum } from "../socket";

/* eslint-disable react/prop-types */
const Username = ({ toggleUsernameSubmit }) => {
  const [username, setUsername] = useState("");

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();

    await cerebellum.auth("http://localhost:3000/login", "POST");
    toggleUsernameSubmit(username);
  };

  return (
    <form className="userName" onSubmit={handleUsernameSubmit}>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Username;
