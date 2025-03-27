import React from "react";
import { View, Text } from "react-native";

const getInitials = (username: string) => {
  const names = username.split(" ");
  const initials = names.map(name => name.charAt(0).toUpperCase()).join("");
  return initials;
};

const Avatar = ({ username, className }: { username: string, className?: string }) => {
  const initials = getInitials(username);

  return (
    <View className={`bg-gray-400 rounded-full w-10 h-10 justify-center items-center ${className}`}>
      <Text className="text-white text-lg font-bold">{initials}</Text>
    </View>
  );
};

export default Avatar;