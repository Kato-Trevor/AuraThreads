import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AppHeader = () => {
  return (
    <View className="flex-row items-center justify-between">
      <Ionicons name="menu" size={24} color="#18392b" />
      <View className="bg-white rounded-full p-2 shadow-md">
          <View className="bg-[#18392b] rounded-full p-2">
         <Ionicons name="leaf-outline" size={24} color="#ffffff" />
    </View>
      </View>
      <Ionicons name="notifications-outline" size={24} color="#18392b" />
    </View>
  );
};

export default AppHeader;
