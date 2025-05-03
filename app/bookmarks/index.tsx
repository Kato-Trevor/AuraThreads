import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { PostsBookmarks } from "@/components/PostsBookmarks";
import { JournalBookmarks } from "@/components/JournalBookmarks";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Bookmarks = () => {
  const [selectedTab, setSelectedTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const slideAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle tab change animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedTab === "posts" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const handleTabChange = (tab: any) => {
    if (tab !== selectedTab) {
      setSelectedTab(tab);
    }
  };

  // Indicator position based on selected tab
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.25 - 30, width * 0.75 - 30],
  });

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Custom Header with Shadow */}
      <View className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 bg-gray-50 rounded-full flex items-center justify-center"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color="#588b76" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <MaterialIcons name="bookmark" size={24} color="#588b76" />
            <Text className="text-xl font-pbold text-gray-800 ml-2">
              My Bookmarks
            </Text>
          </View>

          <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
            <MaterialIcons name="more-vert" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Tab Selector */}
      <View className="bg-white py-4 relative">
        <View className="flex-row justify-around">
          <TouchableOpacity
            className="items-center px-6 py-1"
            onPress={() => handleTabChange("posts")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <FontAwesome
                name="newspaper-o"
                size={16}
                color={selectedTab === "posts" ? "#588b76" : "#6B7280"}
              />
              <Text
                className={
                  selectedTab === "posts"
                    ? "text-secondary font-pbold text-base ml-2"
                    : "text-gray-500 font-pregular text-base ml-2"
                }
              >
                Posts
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-6 py-1"
            onPress={() => handleTabChange("journal")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <FontAwesome
                name="book"
                size={16}
                color={selectedTab === "journal" ? "#588b76" : "#6B7280"}
              />
              <Text
                className={
                  selectedTab === "journal"
                    ? "text-secondary font-pbold text-base ml-2"
                    : "text-gray-500 font-pregular text-base ml-2"
                }
              >
                Journal
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: 60,
            height: 3,
            backgroundColor: "#588b76",
            borderRadius: 3,
            transform: [{ translateX }],
          }}
        />
      </View>

      {/* Content Area */}
      <Animated.View
        className="flex-1 bg-gray-50"
        style={{ opacity: fadeAnim }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#588b76" />
            <Text className="text-gray-500 mt-3">
              Loading your bookmarks...
            </Text>
          </View>
        ) : (
          <>
            {selectedTab === "posts" ? (
              <PostsBookmarks />
            ) : (
              <JournalBookmarks />
            )}
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default Bookmarks;
