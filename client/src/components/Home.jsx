import React, { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import "../CSS/home.css"; // Adjusted path to CSS/home.css
import Info from "./Info";

function Home() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const { current_user, setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/Login');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Hello {current_user.name}</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li>
            <Link to="/Todos">Todos</Link>
          </li>
          <li>
            <Link to="/PostList">Posts</Link>
          </li>
          <li>
            <Link to="/Albums">Albums</Link>
          </li>
          <li>
            <button className="log-out-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="action-buttons">
        <button onClick={() => setShowInfo(!showInfo)}>Info</button>
      </div>

      {showInfo && <Info setShowInfo={setShowInfo} />}

      <Outlet />
    </div>
  );
}

export default Home;
