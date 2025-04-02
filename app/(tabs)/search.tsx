import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { router } from "expo-router";

const SearchScreen = () => {
  const [recentSearches, setRecentSearches] = useState([
    "photography tips",
    "travel destinations",
    "food recipes",
    "fitness routines",
  ]);
  const [trendingTopics, setTrendingTopics] = useState([
    "Summer Fashion",
    "Remote Work",
    "Healthy Habits",
    "DIY Projects",
    "Book Recommendations",
  ]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Function to handle when a recent search or topic is selected
  const handleTopicSelect = (topic: string) => {
    // We can't directly set the input value since your component handles its own state
    // Instead, we'll pass the topic as initialQuery prop which your component can use
    // Your component will handle the routing when the search button is pressed

    router.push(`/search-post/${topic}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 0 }}>
      {/* Reduced header padding */}
      <View className="px-5 pt-1 pb-2">
        <Text className="text-2xl font-bold text-gray-800">Discover</Text>
      </View>

      <View className="px-5">
        <SearchInput placeholderText="Search post by content or by topic" />
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                Recent Searches
              </Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text className="text-pink-500 font-medium">Clear all</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-1">
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center py-2.5 border-b border-gray-100"
                  onPress={() => handleTopicSelect(item)}
                >
                  <Feather name="clock" size={16} color="#666" />
                  <Text className="ml-3 text-gray-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trending Topics Section */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              Trending Topics
            </Text>
            <TouchableOpacity>
              <Text className="text-pink-500 font-medium">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap mt-1">
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                className="bg-pink-100 px-4 py-2 rounded-full mr-2 mb-2"
                onPress={() => handleTopicSelect(topic)}
              >
                <Text className="text-pink-500 font-medium">{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* For You Section */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            For You
          </Text>
          <View className="bg-pink-50 rounded-xl overflow-hidden">
            <View className="h-28 bg-pink-300 opacity-70" />
            <View className="p-3">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                Explore content based on your interests
              </Text>
              <Text className="text-gray-600 mb-3">
                Update your preferences to get personalized recommendations
              </Text>
              <TouchableOpacity className="bg-pink-500 py-2 px-4 rounded-lg self-start">
                <Text className="text-white font-semibold">
                  Update Preferences
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Popular Posts Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Popular Posts
          </Text>

          {[1, 2].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
            >
              <View className="w-24 h-24 bg-pink-200" />
              <View className="flex-1 p-3">
                <View className="flex-row mb-1">
                  <Text className="text-xs font-medium text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {item === 1 ? "Fashion" : "Lifestyle"}
                  </Text>
                </View>
                <Text className="text-base font-medium text-gray-800 mb-1">
                  {item === 1
                    ? "Spring Fashion Trends 2025"
                    : "How to Style Minimalist Outfits"}
                </Text>
                <Text className="text-xs text-gray-500">
                  Published {item === 1 ? "2 days" : "5 days"} ago •{" "}
                  {item === 1 ? "4" : "3"} min read
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="items-center py-3 border border-pink-100 rounded-lg">
            <Text className="text-pink-500 font-medium">View More Posts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
