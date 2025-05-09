import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthLayout = () => {
  const {isLoading, isLoggedIn} = useGlobalContext();
  
  if(isLoading && isLoggedIn) return <Redirect href={"/(tabs)/home"} />

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboard"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F5F5F5" />
    </>
  );
};

export default AuthLayout;
