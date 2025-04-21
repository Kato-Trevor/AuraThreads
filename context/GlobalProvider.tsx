import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/appwrite/auth";

const GlobalContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  enableAnonymousID: boolean;
  setEnableAnonymousID: React.Dispatch<React.SetStateAction<boolean>>;
  enableMoodReminders: boolean;
  setEnableMoodReminders: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  enableAnonymousID: false,
  setEnableAnonymousID: () => {},
  enableMoodReminders: false,
  setEnableMoodReminders: () => {},
  isLoading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enableAnonymousID, setEnableAnonymousID] = useState(false);
  const [enableMoodReminders, setEnableMoodReminders] = useState(false);
  const [user, setUser] = useState<null | any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        enableAnonymousID,
        setEnableAnonymousID,
        enableMoodReminders,
        setEnableMoodReminders,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
