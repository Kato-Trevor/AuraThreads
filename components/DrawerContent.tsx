import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@/lib/appwrite/auth";
import { router } from "expo-router";
import Colors from "@/assets/colors/colors";

type DrawerContentProps = {
  onClose: () => void;
  onLogOut: () => void;
};

const DrawerContent = ({ onClose, onLogOut }: DrawerContentProps) => {
  const handleLogOut = async () => {
    onLogOut();
    await signOut();
    router.replace("/sign-in");
  };

  type DrawerItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
  };

  const DrawerItem = ({ icon, label, onPress, color = "#000" }: DrawerItemProps) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4"
    >
      <Ionicons name={icon} size={24} color={color} />
      <Text className="font-['Poppins-Medium'] text-base ml-4" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white pt-20 px-6">
      {/* Centered leaf icon with proper spacing */}
      <View className="items-center mb-5">
        <View className="bg-white rounded-full p-2 shadow-md">
          <View style={{ backgroundColor: Colors.darkestGreen,}} 
          className="rounded-full p-3 w-12 h-12 items-center justify-center">
            <Ionicons
              name="leaf-outline"
              size={24}
              color="#ffffff"
            />
          </View>
        </View>
      </View>

      <View>
        <DrawerItem
          icon="person-outline"
          label="Profile"
          onPress={() => {
            onClose();
            console.log("Navigate to Profile");
          }}
          color={Colors.Green}
        />
        <DrawerItem
          icon="cloud-outline"
          label="Word Cloud"
          onPress={() => {
            onClose();
            router.push("/WordCloud");
          }}
          color={Colors.Green}
        />
        <DrawerItem
          icon="book-outline"
          label="My Journal"
          onPress={() => {
            onClose();
            console.log("Navigate to My Journal");
          }}
          color={Colors.Green}
        />
        <DrawerItem
          icon="bookmark-outline"
          label="Bookmarks"
          onPress={() => {
            onClose();
            console.log("Navigate to Bookmarks");
          }}
          color={Colors.Green}
        />
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      <View className="border-t" style={{ borderColor: "#d0ded8" }} />
      {/* Logout at the bottom */}
      <DrawerItem
        icon="log-out-outline"
        label="Logout"
        onPress={handleLogOut}
        color={Colors.Green} 
      />
    </View>
  );
};

export default DrawerContent;