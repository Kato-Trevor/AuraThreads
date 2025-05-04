import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@/lib/appwrite/auth";
import { router, usePathname } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { unregisterIndieDevice } from "native-notify";
import { LinearGradient } from "expo-linear-gradient";

type DrawerContentProps = {
  onClose: () => void;
  onLogOut: () => void;
};

const DrawerContent = ({ onClose, onLogOut }: DrawerContentProps) => {
  const { user } = useGlobalContext();
  const pathname = usePathname();
  console.log("User in DrawerContent:", user);

  const handleLogOut = async () => {
    try {
      onLogOut();
      if (user && user.$id) {
        try {
          await unregisterIndieDevice(
            `${user.$id}`,
            29438,
            "zq1jhhUWGWDhHVZRP5yihC"
          );
        } catch (error) {
          console.log("Error unregistering device:", error);
        }
      }
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  type DrawerItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
    badgeCount?: number;
    route: string;
  };

  const DrawerItem = ({
    icon,
    label,
    onPress,
    color = "#18392b",
    badgeCount,
    route,
  }: DrawerItemProps) => {
    const isActive = pathname.includes(route);

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center py-2.5 px-3 my-0.5 rounded-lg active:bg-green-50 ${
          isActive ? "bg-green-50" : ""
        }`}
      >
        <View
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive ? "bg-green-100" : "bg-gray-50"
          }`}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text
          className={`font-pmedium text-base ml-2.5 ${
            isActive ? "text-green-800" : "text-gray-700"
          }`}
        >
          {label}
        </Text>
        {badgeCount ? (
          <View className="bg-green-500 rounded-full h-4 min-w-4 ml-auto items-center justify-center px-1">
            <Text className="text-white text-xs font-bold">
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with gradient */}
      <LinearGradient
        colors={["#588b76", "#588b76"]} // #18392b, #2a5745
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-4 px-4 rounded-b-2xl"
      >
        <View className="flex-row items-center">
          <View className="h-14 w-14 bg-white/20 rounded-full justify-center items-center border border-white/30">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="h-12 w-12 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-lg font-bold text-white">
                {user?.role === "user" && user?.username
                  ? user.username.substring(0, 1).toUpperCase()
                  : user?.role === "counselor"
                  ? user?.surname.substring(0, 1).toUpperCase()
                  : "U"}
              </Text>
            )}
          </View>
          <View className="ml-3">
            <Text className="font-['Poppins-SemiBold'] text-base text-white">
              {user?.username ||
                user?.givenNames?.trim() +
                  (user?.surname ? " " + user.surname.trim() : "") ||
                "User"}
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-white/70">
              {user?.email || ""}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main content */}
      <View className="flex-1 px-3 pt-3">
        {/* Main Navigation Items */}
        <DrawerItem
          icon="person-outline"
          label="Profile"
          route="profile"
          onPress={() => {
            onClose();
            router.push(`/profile/${user.$id}`);
          }}
        />
        <DrawerItem
          icon="book-outline"
          label="Journal"
          route="journal"
          onPress={() => {
            onClose();
            router.push("/journal");
          }}
        />
        <DrawerItem
          icon="bookmark-outline"
          label="Bookmarks"
          route="bookmarks"
          onPress={() => {
            onClose();
            router.push("/bookmarks");
          }}
        />

        <View className="border-t border-gray-200 my-2 opacity-60" />

        {/* Settings */}
        <DrawerItem
          icon="settings-outline"
          label="Settings"
          route="settings"
          onPress={() => {
            onClose();
            router.push("/settings");
          }}
        />

        <View className="flex-1" />

        {/* Logout button with improved styling */}
        <View className="border-t border-gray-200 my-2 opacity-60" />
        <View className="mb-4 mx-1">
        <TouchableOpacity
          onPress={handleLogOut}
          className="flex-row items-center py-2.5 px-3 my-0.5 rounded-lg active:bg-green-50"
        >
          <Ionicons name="log-out-outline" size={24} color="#18392b" />
          <Text className="font-pmedium text-base ml-2.5" style={{color: "#18392b"}}>
            Logout
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DrawerContent;
