import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@/lib/appwrite/auth";
import { router } from "expo-router";

const DrawerContent = ({onLogOut}: {onLogOut: () => void}) => {
  const handleLogOut = async () => {
    onLogOut();
    await signOut();
    router.replace("/sign-in");
  };
  
  return (
    <View className="flex-1 bg-white p-20">
      <TouchableOpacity
        className="flex-row items-center p-4 border-t border-gray-200"
        onPress={() => handleLogOut()}
      >
        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        <Text className="font-['Poppins-Medium'] text-base text-red-500 ml-4">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContent;
