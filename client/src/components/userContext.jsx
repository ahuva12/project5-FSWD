import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [current_user, setCurrentUserState] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUserState(JSON.parse(storedUser)); 
    }
  }, []);

  function setCurrentUser(user) {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.setItem('currentUser', null);
    }
  }

  return (
    <UserContext.Provider value={{ current_user, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
