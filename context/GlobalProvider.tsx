import { useToast } from "@/components/ToastProvider";
// import { initializeFirebase, getCurrentUser } from "@/lib/firebase/firebase";
import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext({});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // const { auth, app } = initializeFirebase();

  // const resetState = () => {
  //   setIsLoggedIn(false);
  //   setUser(null);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     setLoading(true);

  //     if (firebaseUser && firebaseUser?.emailVerified) {
  //       setEmailVerified(true);
  //       try {
  //         const user = await getCurrentUser(auth);

  //         if (user) {
  //           setUser(user);
  //           setIsLoggedIn(true);
  //         } else {
  //           resetState();
  //         }
  //       } catch (error) {
  //         Alert.alert("Error", error.message);
  //         resetState();
  //       }
  //     } else {
  //       resetState();
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [auth]);

  return (
    // <GlobalContext.Provider
    //   value={
    //     {
    //       // auth,
    //       // app,
    //       // isLoggedIn,
    //       // setIsLoggedIn,
    //       // user,
    //       // setUser,
    //       // loading,
    //       // setLoading,
    //       // emailVerified,
    //     }
    //   }
    // >
    //   {children}
    // </GlobalContext.Provider>
    <></>
  );
};

export default GlobalProvider;
