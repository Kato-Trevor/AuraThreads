import React from "react";
import { View, Text, Image } from "react-native";

const getInitials = (username: string) => {
  const names = username.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
};

const Avatar = ({
  username,
  imageUrl,
  className,
}: {
  username: string;
  imageUrl?: string;
  className?: string;
}) => {
  const initials = getInitials(username);

  return (
    <View
      className={`bg-[#d0ded8] rounded-full w-10 h-10 justify-center items-center overflow-hidden ${className}`}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className="text-white text-lg font-bold">{initials}</Text>
      )}
    </View>
  );
};

export default Avatar;