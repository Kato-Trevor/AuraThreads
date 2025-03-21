import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AppHeader = () => {
  return (
    <View className="flex-row items-center justify-between">
      <Ionicons name="menu" size={24} color="black" />
      <View className="bg-white rounded-full p-2 shadow-md">
        <View className="bg-secondary-100 rounded-full p-2">
          <Ionicons name="leaf-outline" size={24} color="#FFE4E1" />
        </View>
      </View>
      <Ionicons name="notifications-outline" size={24} color="black" />
    </View>
  );
};

export default AppHeader;