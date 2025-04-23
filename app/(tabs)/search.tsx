import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { articles, Article } from "@/components/Articles";
import MoodLogModal from "@/components/MoodLog";

const RECENT_SEARCHES_KEY = "aura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// Function to get random articles
const getRandomArticles = (articles: Article[], count: number): Article[] => {
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for articles
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isShowingMoreArticles, setIsShowingMoreArticles] = useState(false);

  // Load articles - in a real app, this would come from your API or data file
  const allArticles = articles;

  useEffect(() => {
    loadRecentSearches();
    // Initialize with 2 random articles
    setDisplayedArticles(getRandomArticles(allArticles, 2));
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
    // Show 10 random articles total when "View More Resources" is clicked
    setDisplayedArticles(getRandomArticles(allArticles, 10));
    setIsShowingMoreArticles(true);
  };

  const handleArticlePress = (article: Article) => {
    // Navigate to article detail screen
    router.push(`/article/${article.id}` as any);
  };

  // Create a component for article item
  const ArticleItem = ({ article }: { article: Article }) => {
    // Determine what icon to show based on article title keywords
    const getIconName = (title: string) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes("sleep")) return "sleep";
      if (lowerTitle.includes("meditation") || lowerTitle.includes("breathing"))
        return "meditation";
      if (lowerTitle.includes("exercise") || lowerTitle.includes("physical"))
        return "run";
      if (
        lowerTitle.includes("food") ||
        lowerTitle.includes("nutrition") ||
        lowerTitle.includes("eat")
      )
        return "food-apple";
      return "book-open-page-variant"; // default icon
    };

    // Determine category based on title keywords
    const getCategory = (title: string) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes("anxiety")) return "Anxiety";
      if (lowerTitle.includes("depression")) return "Depression";
      if (lowerTitle.includes("sleep")) return "Sleep";
      if (lowerTitle.includes("stress")) return "Stress";
      if (lowerTitle.includes("mindful")) return "Mindfulness";
      return "Wellness"; // default category
    };

    // Calculate a readable time from the article content
    const getReadTime = (content: string) => {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    };

    // Get date relative to today
    const getRelativeDate = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
      <TouchableOpacity
        className="flex-row mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
        onPress={() => handleArticlePress(article)}
      >
        <View className="w-24 h-24 bg-secondary-200 items-center justify-center">
          <MaterialCommunityIcons
            name={getIconName(article.title)}
            size={32}
            color="#295f48"
          />
        </View>
        <View className="flex-1 p-3">
          <View className="flex-row mb-1">
            <Text className="text-xs font-pmedium text-secondary bg-secondary-200/50 px-2 py-0.5 rounded-full">
              {getCategory(article.title)}
            </Text>
          </View>
          <Text
            className="text-base font-pmedium text-gray-800 mb-1"
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <Text className="font-pregular text-xs text-gray-500">
            Published {getRelativeDate(article.date)} •{" "}
            {getReadTime(article.fullContent)}
          </Text>
        </View>
      </TouchableOpacity>
    );
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

        <MoodLogModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false);
            console.log("Mood logged successfully");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
