import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Article } from "@/components/Articles";
import { router } from "expo-router";

interface ArticleItemProps {
  article: Article;
}

const ArticleItem = ({ article }: ArticleItemProps) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  // Determine what icon to show based on article title keywords
  const getIconName = (title: string): string => {
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
  const getCategory = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("anxiety")) return "Anxiety";
    if (lowerTitle.includes("depression")) return "Depression";
    if (lowerTitle.includes("sleep")) return "Sleep";
    if (lowerTitle.includes("stress")) return "Stress";
    if (lowerTitle.includes("mindful")) return "Mindfulness";
    return "Wellness"; // default category
  };

  // Calculate a readable time from the article content
  const getReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Get date relative to today
  const getRelativeDate = (dateString: string): string => {
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

  const handleArticlePress = (article: Article) => {
    // Navigate to article detail screen
    router.push(`/article/${article.id}` as any);
  };

  // Toggle bookmark status
  const toggleBookmark = (e: any): void => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <TouchableOpacity
      className="flex-row mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
      onPress={() => handleArticlePress(article)}
      activeOpacity={0.7}
    >
      <View className="w-24 h-24 bg-secondary-200 items-center justify-center">
        <MaterialCommunityIcons
          name={getIconName(article.title) as any}
          size={32}
          color="#295f48"
        />
      </View>
      <View className="flex-1 p-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs font-pmedium text-secondary bg-secondary-200/50 px-2 py-0.5 rounded-full">
            {getCategory(article.title)}
          </Text>

          <TouchableOpacity
            onPress={toggleBookmark}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={bookmarked ? "bookmark" : "bookmark-o"}
              size={16}
              color={bookmarked ? "#295f48" : "#9ca3af"}
            />
          </TouchableOpacity>
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

export default ArticleItem;
