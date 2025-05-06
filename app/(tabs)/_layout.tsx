import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const TabIcon = ({
  iconName,
  color,
  name,
  focused,
}: {
  iconName: string;
  color: string;
  name: string;
  focused: boolean;
}) => {
  return (
    <View className="flex items-center justify-center w-20 mt-3">
      <Ionicons name={iconName as any} size={24} color={color} />
      <Text
        className={`text-xs text-center ${
          focused ? "font-psemibold" : "font-pregular"
        }`}
        numberOfLines={1}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#Fff",
            // borderTopWidth: 1,
            // borderTopColor: "#CDCDE0",
            height: 80,
            elevation: 5,
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#588b76",
          tabBarInactiveTintColor: "#7D7D7D",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="home"
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="compass"
                color={color}
                name="Discover"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="trending"
          options={{
            title: "Trending",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="trending-up"
                color={color}
                name="Trends"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
