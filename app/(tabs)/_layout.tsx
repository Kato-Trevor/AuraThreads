import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";

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
      <StatusBar style="dark" backgroundColor="#F5F5F5" />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#F5F5F5",
            borderTopWidth: 1,
            borderTopColor: "#CDCDE0",
            height: 80,
            elevation: 0,
          },
          tabBarActiveTintColor: "#F032DA",
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
                iconName="search"
                color={color}
                name="Search"
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
                iconName="flame"
                color={color}
                name="Trending"
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
