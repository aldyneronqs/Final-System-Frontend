import React from "react";

const UserContext = React.createContext({
  user: { id: null, isAdmin: null }, 
  setUser: () => {},
  unsetUser: () => {}
});

export const UserProvider = UserContext.Provider;

export default UserContext;
