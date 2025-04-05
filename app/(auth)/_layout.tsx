import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { View, StyleSheet, Platform } from "react-native";

const AuthLayout = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading && isLoggedIn) return <Redirect href={"/(tabs)/home"} />;

  return (
    <>
      <View style={styles.statusBarWrapper}>
        {/* <StatusBar style="dark" backgroundColor="#FFFFFF" /> */}
      </View>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboard"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarWrapper: {
    backgroundColor: "#f6f6f6",
    height: Platform.OS === "android" ? 24 : 44, // Adjust for status bar height
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10,
  },
});

export default AuthLayout;
