import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

const home = () => {
  const { user } = useGlobalContext();
  console.log("user from home is here", user);
  
  return (
    <View>
      <Text>home</Text>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({});
