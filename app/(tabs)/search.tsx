import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const RECENT_SEARCHES_KEY = "aura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const SearchScreen = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState([
    "Self-Care Routines",
    "Sleep Improvement",
    "ImposterSyndrome",
    "Procrastination",
    "Burnout",
    "Homesickness",
  ]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const storedSearches = await SecureStore.getItemAsync(
        RECENT_SEARCHES_KEY
      );
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await SecureStore.setItemAsync(
        RECENT_SEARCHES_KEY,
        JSON.stringify(searches)
      );
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const addToRecentSearches = async (query: string) => {
    if (!query.trim()) return;

    const updatedSearches = [query];
    recentSearches.forEach((search) => {
      if (
        search.toLowerCase() !== query.toLowerCase() &&
        updatedSearches.length < MAX_RECENT_SEARCHES
      ) {
        updatedSearches.push(search);
      }
    });

    setRecentSearches(updatedSearches);
    await saveRecentSearches(updatedSearches);
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await saveRecentSearches([]);
  };

  const handleTopicSelect = (topic: string) => {
    addToRecentSearches(topic);
    router.push(`/search-post/${topic}` as any);
  };

  const handleSearch = (query: string) => {
    addToRecentSearches(query);
    router.push(`/search-post/${query}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 0 }}>
      {/* Header */}
      <View className="px-5 pt-1 pb-2">
        <Text className="text-2xl font-pbold text-gray-800">Discover</Text>
      </View>

      {/* Search Input */}
      <View className="px-5">
        <SearchInput
          placeholderText="Search mental health resources..."
          onSearch={handleSearch}
        />
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-psemibold text-gray-800">
                Recent Searches
              </Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text className="text-secondary font-pmedium">Clear all</Text>
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
                  <Text className="font-plight ml-3 text-gray-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trending Topics Section */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-psemibold text-gray-800">
              Trending Mental Health Topics
            </Text>
            <TouchableOpacity>
              <Text className="text-secondary font-pmedium">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap mt-1">
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                className="bg-secondary-200/50 px-4 py-2 rounded-full mr-2 mb-2"
                onPress={() => handleTopicSelect(topic)}
              >
                <Text className="text-secondary font-pmedium">{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mental Health Assessment Section */}
        <View className="mb-4">
          <Text className="text-lg font-psemibold text-gray-800 mb-2">
            Your Wellbeing
          </Text>
          <View className="bg-secondary-200/40 rounded-xl overflow-hidden">
            <View className="h-28 bg-secondary-200 opacity-70" />
            <View className="p-3">
              <Text className="text-lg font-psemibold text-gray-800 mb-1">
                Take a mental health assessment
              </Text>
              <Text className="font-pregular text-gray-600 mb-3">
                Understand your current state of mind with our quick
                questionnaire
              </Text>
              <TouchableOpacity className="bg-secondary py-2 px-4 rounded-lg self-start">
                <Text className="text-white font-psemibold">
                  Start Assessment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Popular Resources Section */}
        <View className="mb-6">
          <Text className="text-lg font-psemibold text-gray-800 mb-2">
            Recommended Resources
          </Text>

          <TouchableOpacity
            className="flex-row mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
            onPress={() => handleTopicSelect("Breathing Techniques")}
          >
            <View className="w-24 h-24 bg-secondary-200 items-center justify-center">
              <MaterialCommunityIcons
                name="meditation"
                size={32}
                color="#295f48"
              />
            </View>
            <View className="flex-1 p-3">
              <View className="flex-row mb-1">
                <Text className="text-xs font-pmedium text-secondary bg-secondary-200/50 px-2 py-0.5 rounded-full">
                  Anxiety
                </Text>
              </View>
              <Text className="text-base font-medium text-gray-800 mb-1">
                5 Breathing Exercises for Instant Calm
              </Text>
              <Text className="font-pregular text-xs text-gray-500">
                Published 2 days ago • 4 min read
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
            onPress={() => handleTopicSelect("Sleep Hygiene")}
          >
            <View className="w-24 h-24 bg-secondary-200 items-center justify-center">
              <MaterialCommunityIcons name="sleep" size={32} color="#295f48" />
            </View>
            <View className="flex-1 p-3">
              <View className="flex-row mb-1">
                <Text className="text-xs font-pmedium text-secondary bg-secondary-200/50 px-2 py-0.5 rounded-full">
                  Sleep
                </Text>
              </View>
              <Text className="text-base font-pmedium text-gray-800 mb-1">
                Improve Your Sleep Quality Tonight
              </Text>
              <Text className="font-pregular text-xs text-gray-500">
                Published 5 days ago • 3 min read
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center py-3 border border-secondary-200 rounded-lg"
            // onPress={() => router.push("/resources")}
          >
            <Text className="text-secondary font-pmedium">
              View More Resources
            </Text>
          </TouchableOpacity>
        </View>

        {/* Community Support Section */}
        <View className="mb-6">
          <Text className="text-lg font-psemibold text-gray-800 mb-2">
            Community Support
          </Text>

          <TouchableOpacity
            className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-3"
            // onPress={() => router.push("/support-groups")}
          >
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#295f48"
              />
              <Text className="ml-2 text-base font-psemibold text-gray-800">
                Support Groups
              </Text>
            </View>
            <Text className="font-pregular text-sm text-gray-600">
              Connect with others who understand what you're going through
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gradient-to-r from-pink-50 to-blue-50 p-4 rounded-xl"
            // onPress={() => router.push("/therapists")}
          >
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="hand-heart"
                size={24}
                color="#295f48"
              />
              <Text className="ml-2 text-base font-psemibold text-gray-800">
                Find a Therapist
              </Text>
            </View>
            <Text className="font-pregular text-sm text-gray-600">
              Professional help is just a tap away
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
