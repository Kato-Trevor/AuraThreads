import React from "react";
import { View, Text, Image } from "react-native";

const getInitials = (username: string) => {
  if (!username) return "?";
  const names = username.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials.substring(0, 2);
};

const Avatar = ({
  username,
  imageUrl,
  className,
  size = "medium",
}: {
  username?: string;
  imageUrl?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}) => {
  const initials = getInitials(username ?? "");

  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-lg",
    large: "w-12 h-12 text-xl",
  };

  const containerSize = sizeClasses[size].split(" ").slice(0, 2).join(" ");
  const textSize = sizeClasses[size].split(" ").slice(2).join(" ");

  return (
    <View
      className={`bg-secondary rounded-full ${containerSize} justify-center items-center overflow-hidden shadow-sm ${className}`}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className={`text-white font-pbold ${textSize}`}>{initials}</Text>
      )}
    </View>
  );
};

export default Avatar;
