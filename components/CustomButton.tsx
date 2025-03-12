import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface CustomButtonProps {
  title: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  icon,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-secondary rounded-2xl min-h-[62px] justify-center items-center shadow-sm
        ${containerStyles} ${isLoading ? "opacity-70" : ""}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`font-bold text-lg ${textStyles}`}>{title}</Text>
        </View>
      )}

      {/* Button highlight effect */}
      <View className="absolute top-0 left-0 right-0 h-1/3 bg-white opacity-20 rounded-t-2xl" />
    </TouchableOpacity>
  );
};

export default CustomButton;
