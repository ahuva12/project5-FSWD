import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import "../CSS/login.css"; // Adjusted path to css/login.css

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { current_user, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    setCurrentUser(null);
  }, [current_user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users');
      const users_list = await response.json();

      for (let i = 0; i < users_list.length; i++) {
        if (users_list[i].username === username) {
          if (users_list[i].website === password) {
            setTimeout(() => {
              const currentUser = users_list[i];
              console.log(currentUser);
              setCurrentUser(currentUser); 
              navigate(`/Home?username=${username}`);
            }, 1000);
            return;
          } else {
            alert("Your password is incorrect");
            setPassword("");
            return;
          }
        }
      }
      alert("Your username is incorrect");
      setUsername("");
      setPassword("");
    } catch (error) {
      alert("Failed to fetch users. Please try again later.");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <div className="new-user-container">
        <button onClick={() => navigate("/Register")}>New User ?</button>
      </div>
    </div>
  );
}

export default Login;
