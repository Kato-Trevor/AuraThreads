import React from "react";
import { View, Text } from "react-native";

const getInitials = (username: string) => {
  const names = username.split(" ");
  const initials = names.map(name => name.charAt(0).toUpperCase()).join("");
  return initials;
};

const Avatar = ({ username }: { username: string }) => {
  const initials = getInitials(username);

  return (
    <View className="bg-gray-400 rounded-full w-12 h-12 justify-center items-center">
      <Text className="text-white text-lg font-bold">{initials}</Text>
    </View>
  );
};

export default Avatar;