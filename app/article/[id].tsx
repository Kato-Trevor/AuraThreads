import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { articles, Article } from "@/components/Articles";
import LoadingSpinner from "@/components/LoadingSpinner";

const ArticleDetailScreen = () => {
  const { id: articleId } = useLocalSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const foundArticle = articles.find((a) => a.id === Number(articleId));
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [articleId]);

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Loading article...</Text>
      </SafeAreaView>
    );
  }

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatContent = (content: string) => {
    const sentences = content.split(". ").filter((s) => s.trim());
    const paragraphs = [];

    for (let i = 0; i < sentences.length; i += 3) {
      const paragraph = sentences.slice(i, i + 3).join(". ");
      paragraphs.push(paragraph + (paragraph.endsWith(".") ? "" : "."));
    }

    return paragraphs;
  };

  const getCategory = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("anxiety")) return "Anxiety";
    if (lowerTitle.includes("depression")) return "Depression";
    if (lowerTitle.includes("sleep")) return "Sleep";
    if (lowerTitle.includes("stress")) return "Stress";
    if (lowerTitle.includes("mindful")) return "Mindfulness";
    return "Wellness";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-2 flex-row justify-between items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#295f48" />
        </TouchableOpacity>
        <Text className="text-base font-psemibold text-gray-800">Article</Text>
        <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
          <Feather
            name={isBookmarked ? "bookmark" : "bookmark"}
            size={24}
            color="#295f48"
          />
        </TouchableOpacity>
      </View>

      {article ? (
        <ScrollView className="flex-1 px-4">
          {/* Article Header */}
          <View className="py-4">
            <View className="flex-row mb-2">
              <Text className="text-xs font-pmedium text-secondary bg-secondary-200/50 px-2 py-0.5 rounded-full">
                {getCategory(article.title)}
              </Text>
            </View>
            <Text className="text-2xl font-pbold text-gray-800 mb-2">
              {article.title}
            </Text>
            <View className="flex-row items-center mb-3">
              <Text className="text-sm font-pmedium text-gray-600 mr-4">
                {article.author}
              </Text>
              <Text className="text-sm font-pregular text-gray-500">
                {formatDate(article.date)}
              </Text>
            </View>
          </View>

          {/* Article Content */}
          <View className="mb-6">
            {formatContent(article.fullContent).map((paragraph, index) => (
              <Text
                key={index}
                className="text-base font-pregular text-gray-700 mb-4 leading-6"
              >
                {paragraph}
              </Text>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              className="flex-1 mr-2 bg-secondary py-3 rounded-lg items-center"
              onPress={() => {
                // In a real app, this would share the article
                Alert.alert(
                  "Share",
                  "Sharing functionality would be implemented here"
                );
              }}
            >
              <View className="flex-row items-center">
                <Feather name="share-2" size={18} color="white" />
                <Text className="text-white font-pmedium ml-2">Share</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 ml-2 bg-white border border-secondary py-3 rounded-lg items-center"
              onPress={() => {
                // In a real app, this would open the source link
                Alert.alert("Source", `Opening source: ${article.link}`);
              }}
            >
              <View className="flex-row items-center">
                <Feather name="external-link" size={18} color="#295f48" />
                <Text className="text-secondary font-pmedium ml-2">Source</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Related Articles */}
          <View className="mb-8">
            <Text className="text-lg font-psemibold text-gray-800 mb-3">
              Related Articles
            </Text>

            {/* This would display related articles in a real app */}
            <TouchableOpacity
              className="bg-gray-100 py-3 rounded-lg items-center"
              onPress={() => router.push("/search")}
            >
              <Text className="text-secondary font-pmedium">
                Explore More Articles
              </Text>
            </TouchableOpacity>
          </View>

          <LoadingSpinner visible={!article} />
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No article found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
