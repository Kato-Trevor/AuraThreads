import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { articles, Article } from "@/components/Articles";
import MoodLogModal from "@/components/MoodLog";
import { getMostUsedTopics } from "@/lib/appwrite/posts";
import ArticleItem from "@/components/ArticleItem";
import { getUsersByRole } from "@/lib/appwrite/auth";
import { FlatList } from "react-native-gesture-handler";

const RECENT_SEARCHES_KEY = "aura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const getRandomArticles = (articles: Article[], count: number): Article[] => {
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const SearchScreen = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isShowingMoreArticles, setIsShowingMoreArticles] = useState(false);
  const allArticles = articles;

  const [isLoadingCounselors, setIsLoadingCounselors] = useState(false);
  const [counselors, setCounselors] = useState<any>([]);
  const [isCounselorsVisible, setIsCounselorsVisible] = useState(false);

  const fetchCounselors = async () => {
    try {
      setIsLoadingCounselors(true);
      const counselors = await getUsersByRole("counselor");
      setCounselors(counselors);
    } catch (error) {
      console.error("Error fetching counselors:", error);
    } finally {
      setIsLoadingCounselors(false);
    }
  };

  const openCounselorsModal = async () => {
    setIsCounselorsVisible(true);
    setIsLoadingCounselors(true);
    await fetchCounselors();
    setIsLoadingCounselors(false);
  };

  useEffect(() => {
    loadRecentSearches();
    setDisplayedArticles(getRandomArticles(allArticles, 2));
  }, []);

  const loadTrendingTopics = async () => {
    try {
      const topics = await getMostUsedTopics();
      setTrendingTopics(topics as string[]);
    } catch (error) {
      console.error("Error loading trending topics:", error);
    }
  };

  useEffect(() => {
    loadTrendingTopics();
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

  const handleViewMoreResources = () => {
    setDisplayedArticles(getRandomArticles(allArticles, 10));
    setIsShowingMoreArticles(true);
  };

  const renderCounselor = ({ item }: { item: any }) => {
    return (
      <Link
        href={{
          pathname: "/profile/[id]",
          params: { id: `${item.$id}` },
        }}
      >
        <View className="flex-row items-center p-4 rounded-xl mb-5 bg-secondary-200/40 border border-secondary-200/10">
          <View className="relative mr-4">
            <Image
              source={{ uri: item.avatar }}
              className="w-14 h-14 rounded-lg"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text
              numberOfLines={1}
              className="text-base font-pbold text-secondary-darkest"
            >
              {item.surname} {item.givenNames}
            </Text>
            <Text numberOfLines={1} className="text-sm text-secondary-dark">
              {item.email}
            </Text>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 0 }}>
      {/* Header */}
      <View className="px-5 pb-2">
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
            <View className="p-3">
              <Text className="text-lg font-psemibold text-gray-800 mb-1">
                Take a mental health assessment
              </Text>
              <Text className="font-pregular text-gray-600 mb-3">
                Select how you feel on our simple mood scale
              </Text>
              <TouchableOpacity
                className="bg-secondary py-2 px-4 rounded-lg self-start"
                onPress={() => setIsModalVisible(true)}
              >
                <Text className="text-white font-psemibold">
                  Start Assessment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended Resources Section (Articles) */}
        <View className="mb-6">
          <Text className="text-lg font-psemibold text-gray-800 mb-2">
            Recommended Resources
          </Text>

          {/* Display articles */}
          {displayedArticles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}

          <TouchableOpacity
            className="items-center py-3 border border-secondary-200 rounded-lg"
            onPress={handleViewMoreResources}
            disabled={isShowingMoreArticles}
          >
            <Text className="text-secondary font-pmedium">
              {isShowingMoreArticles
                ? "All Resources Loaded"
                : "View More Resources"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Community Support Section */}
        <View className="mb-6">
          <Text className="text-lg font-psemibold text-gray-800 mb-2">
            Support
          </Text>

          <TouchableOpacity
            className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-3"
            onPress={() => router.push("/home")}
          >
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#295f48"
              />
              <Text className="ml-2 text-base font-psemibold text-gray-800">
                Community Support
              </Text>
            </View>
            <Text className="font-pregular text-sm text-gray-600">
              Connect with others who understand what you're going through
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gradient-to-r from-pink-50 to-blue-50 p-4 rounded-xl"
            onPress={openCounselorsModal}
          >
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="hand-heart"
                size={24}
                color="#295f48"
              />
              <Text className="ml-2 text-base font-psemibold text-gray-800">
                Find a Counselor
              </Text>
            </View>
            <Text className="font-pregular text-sm text-gray-600">
              Professional help is just a tap away
            </Text>
          </TouchableOpacity>
        </View>

        <MoodLogModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false);
            console.log("Mood logged successfully");
          }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={isCounselorsVisible}
        >
          <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-gradient-to-r from-violet-50 to-indigo-50 pt-safe">
              <View className="flex-row justify-between items-center px-6 py-4">
                <Text className="text-xl font-pbold text-gray-900">
                  Counselors
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsCounselorsVisible(false);
                  }}
                  className="w-9 h-9 items-center justify-center rounded-full bg-white/70 border border-gray-100"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={counselors}
              keyExtractor={(item) => item.$id}
              renderItem={renderCounselor}
              ListEmptyComponent={
                isLoadingCounselors ? (
                  <View className="justify-center items-center p-8">
                    <ActivityIndicator size="large" color="#1e4635" />
                  </View>
                ) : (
                  <View className="justify-center items-center p-8">
                    <View className="bg-secondary-100/30 p-4 rounded-full">
                      <Feather name="search" size={36} color="#1e4635" />
                    </View>
                    <Text className="font-pregular mt-4 text-secondary-dark text-center">
                      No counselors found
                    </Text>
                  </View>
                )
              }
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
