import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  const setUserTypeContext = (type) => {
    setUserType(type);
  };

  return (
    <UserContext.Provider value={{ userType, setUserTypeContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
