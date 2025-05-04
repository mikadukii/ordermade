import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null or user object
  const [isAdmin, setIsAdmin] = useState(false); // example role flag

  return (
    <AppContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
