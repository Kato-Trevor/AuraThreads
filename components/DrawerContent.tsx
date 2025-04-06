import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "@/lib/appwrite/auth";
import { router } from "expo-router";
import { useToast } from "./ToastProvider";
import { useGlobalContext } from "@/context/GlobalProvider";

const DrawerContent = ({ onLogOut }: { onLogOut: () => void }) => {
  const { user, enableAnonymousID, setEnableAnonymousID } = useGlobalContext();
  const { showToast } = useToast();

  const handleLogOut = async () => {
    onLogOut();
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <View className="flex-1 bg-white pt-20">
      {(user && user.role === "student") && (
        <View className="flex-row items-center justify-between p-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="account-eye-outline"
              size={24}
              color={enableAnonymousID ? "#F032DA" : "#666"}
            />
            <Text
              className={"ml-2 mr-2 font-medium text-gray-700"}
            >
              Use anonymous username
            </Text>
            <TouchableOpacity
              onPress={() =>
                showToast("All engagements will be anonymous", "info")
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <Switch
            value={enableAnonymousID}
            onValueChange={() => setEnableAnonymousID(!enableAnonymousID)}
            trackColor={{ false: "#ccc", true: "#F032DA" }}
            thumbColor={enableAnonymousID ? "#fff" : "#f4f3f4"}
            style={{
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
            }}
          />
        </View>
      )}
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
