import React from "react";
import { View, Text, Animated } from "react-native";
import { ToastConfigParams } from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "nativewind";

const CustomToast: React.FC<ToastConfigParams<any>> = ({
  text1,
  text2,
  type,
}) => {
  const { colorScheme } = useColorScheme();
  const iconSize = 24;
  const shadowColor =
    colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const getConfig = () => {
    const base = {
      icon: "check-circle",
      iconColor: "#10b981",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      textColor: "text-emerald-800",
    };

    switch (type) {
      case "success":
        return {
          icon: "check-circle",
          iconColor: "#10b981",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          textColor: "text-emerald-800",
        };
      case "error":
        return {
          icon: "close-circle",
          iconColor: "#ef4444",
          bg: "bg-red-50",
          border: "border-red-100",
          textColor: "text-red-800",
        };
      case "info":
      default:
        return {
          icon: "information",
          iconColor: "#3b82f6",
          bg: "bg-blue-50",
          border: "border-blue-100",
          textColor: "text-blue-800",
        };
    }
  };

  const { icon, iconColor, bg, border, textColor } = getConfig();

  return (
    <Animated.View
      className={`flex-row items-center rounded-lg px-4 py-3 w-[95%] min-h-[60px] mb-2 mx-2 ${bg} ${border} border`}
      style={{
        shadowColor: shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View className="mr-3">
        <MaterialCommunityIcons
          name={icon as any}
          size={iconSize}
          color={iconColor}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`text-sm font-psemibold mb-0.5 ${textColor}`}
          numberOfLines={1}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            className={`text-sm font-pregular ${textColor} opacity-80`}
            numberOfLines={2}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export default CustomToast;
