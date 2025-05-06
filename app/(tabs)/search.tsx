import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { articles, Article } from "@/components/Articles";
import MoodLogModal from "@/components/MoodLog";
import { getMostUsedTopics } from "@/lib/appwrite/posts";
import ArticleItem from "@/components/ArticleItem";
import { getUsersByRole } from "@/lib/appwrite/auth";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RECENT_SEARCHES_KEY = "aura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const getRandomArticles = (articles: Article[], count: number): Article[] => {
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CounselorsModal = ({
  visible,
  onClose,
  counselors,
  isLoading,
  onCounselorSelect,
}: any) => {
  const insets = useSafeAreaInsets();

  const renderCounselor = ({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => onCounselorSelect(item.$id)}>
        <View className="flex-row items-center p-4 rounded-xl mb-3 bg-white border border-gray-100 shadow-sm">
          <View className="relative mr-4">
            <Image
              source={{ uri: item.avatar }}
              className="w-16 h-16 rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </View>
          <View className="flex-1 justify-center">
            <Text
              numberOfLines={1}
              className="text-base font-pbold text-gray-800"
            >
              {item.surname} {item.givenNames}
            </Text>
            <Text numberOfLines={1} className="text-sm text-gray-500 mb-1">
              {item.email}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#9CA3AF"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = useCallback((item: any) => item.$id, []);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View className="justify-center items-center p-8">
          <ActivityIndicator size="large" color="#1e4635" />
          <Text className="font-pmedium mt-4 text-secondary-dark text-center">
            Loading counselors...
          </Text>
        </View>
      );
    }

    return (
      <View className="justify-center items-center p-8">
        <View className="bg-secondary-100/30 p-6 rounded-full mb-4">
          <Feather name="users" size={36} color="#1e4635" />
        </View>
        <Text className="font-pbold text-lg text-gray-800 mb-2 text-center">
          No counselors found
        </Text>
        <Text className="font-pregular text-secondary-dark text-center px-8">
          We couldn't find any counselors at the moment. Please try again later.
        </Text>
      </View>
    );
  }, [isLoading]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-white"
        style={{
          paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        }}
      >
        {/* Header */}
        <View
          className="bg-gradient-to-r from-secondary-100 to-secondary-200"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row justify-between items-center px-5 py-4">
            <View>
              <Text className="text-2xl font-pbold text-gray-900">
                Counselors
              </Text>
              <Text className="text-sm font-pregular text-gray-700">
                {counselors.length} professionals available
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
            >
              <MaterialCommunityIcons name="close" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={counselors}
          keyExtractor={keyExtractor}
          renderItem={renderCounselor}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
    </Modal>
  );
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
    await fetchCounselors();
  };

  const handleCounselorSelect = (counselorId: string) => {
    // First close the modal
    setIsCounselorsVisible(false);
    // Then navigate to the counselor profile
    router.push(`/profile/${counselorId}`);
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

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      className="flex-1 bg-white"
      style={{ paddingTop: 0 }}
    >
      {/* Search Input */}
      <View className="px-5 pt-3">
        <SearchInput placeholderText="Search here..." onSearch={handleSearch} />
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
              Trending Mental Health Issues
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
          }}
        />

        <CounselorsModal
          visible={isCounselorsVisible}
          onClose={() => setIsCounselorsVisible(false)}
          counselors={counselors}
          isLoading={isLoadingCounselors}
          onCounselorSelect={handleCounselorSelect}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
