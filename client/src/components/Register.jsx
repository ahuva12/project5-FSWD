import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import "../CSS/register.css"; // Adjusted path to css/register.css

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !passwordVerify) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== passwordVerify) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users');
      const users_list = await response.json();

      let usernameExists = false;

      for (let i = 0; i < users_list.length; i++) {
        if (users_list[i].username === username) {
          usernameExists = true;
          break;
        }
      }

      if (usernameExists) {
        alert("Username already exists. Please choose another.");
      } 
      else {
        setTimeout(() => {
          const currentUser = {
            username: username,
            password: password,
          };
          setCurrentUser(currentUser); 
          navigate("/CompleteDetails");
        }, 1000);
      }
    } 
    catch (error) {
      alert("Failed to fetch users. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:  </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:  </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Password (Verify):  </label>
          <input
            type="password"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="already-user">
        <button onClick={() => navigate("/Login")}>Already a User?</button>
      </div>
    </div>
  );
}

export default Register;
