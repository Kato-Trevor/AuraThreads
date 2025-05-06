import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { articles, Article } from "@/components/Articles";
import LoadingSpinner from "@/components/LoadingSpinner";
import * as WebBrowser from "expo-web-browser";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  addBookmarkToDB,
  getBookmarksByUserID,
  deleteBookmarkFromDB,
} from "@/lib/appwrite/bookmarks";
import { useToast } from "@/components/ToastProvider";

const ArticleDetailScreen = () => {
  const { id: articleId } = useLocalSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const { user } = useGlobalContext();
  const { showToast } = useToast();

  useEffect(() => {
    const foundArticle = articles.find((a) => a.id === Number(articleId));
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [articleId]);

  useEffect(() => {
    const fetchBookmark = async () => {
      if (user && article) {
        try {
          const userBookmarks = await getBookmarksByUserID(user.$id);
          const match = userBookmarks.find(
            (b: any) => b.articleId === article.id
          );
          setBookmarkId(match?.$id ?? null);
        } catch (error) {
          console.error("Error fetching article bookmarks:", error);
        }
      }
    };
    fetchBookmark();
  }, [user, article]);

  const toggleBookmark = async () => {
    if (!user) return;
    if (!article) return;

    try {
      if (bookmarkId) {
        await deleteBookmarkFromDB(bookmarkId);
        setBookmarkId(null);
        showToast("Removed bookmark", "info");
      } else {
        const newBookmark = await addBookmarkToDB(
          user.$id,
          article.id.toString(),
          "article"
        );
        setBookmarkId(newBookmark.$id);
        showToast("Bookmarked!", "success");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showToast("Something went wrong!", "error");
    }
  };

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

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

  const openSourceLink = async () => {
    if (article && article.link) {
      await WebBrowser.openBrowserAsync(article.link);
    } else {
      Alert.alert("Error", "Source link not available");
    }
  };

  const estimatedReadTime = Math.max(
    3,
    Math.ceil(article.fullContent.length / 1000)
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 bg-secondary/95 shadow-sm">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full justify-center items-center"
          >
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-base font-psemibold text-white">Article</Text>
          <TouchableOpacity
            onPress={toggleBookmark}
            className="w-10 h-10 rounded-full justify-center items-center"
          >
            <Ionicons
              name={bookmarkId ? "bookmark" : "bookmark-outline"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {article ? (
        <ScrollView className="flex-1 px-4">
          <View className="py-5 border-b border-gray-100">
            <View className="flex-row mb-3">
              <Text className="text-xs font-pmedium text-secondary bg-secondary-200/40 px-3 py-1 rounded-full">
                {getCategory(article.title)}
              </Text>
              <View className="flex-row items-center ml-3">
                <Feather name="clock" size={14} color="#666" />
                <Text className="text-xs font-pmedium text-gray-600 ml-1">
                  {estimatedReadTime} min read
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-pbold text-gray-800 mb-3 leading-tight">
              {article.title}
            </Text>
            <View className="flex-row items-center mb-1">
              <View className="w-7 h-7 rounded-full bg-secondary/20 justify-center items-center mr-2">
                <Text className="text-xs font-pbold text-secondary">
                  {article.author.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-sm font-pmedium text-gray-700 mr-4">
                {article.author}
              </Text>
            </View>
            <Text className="text-sm font-pregular text-gray-500 ml-9">
              {formatDate(article.date)}
            </Text>
          </View>

          <View className="my-5">
            {formatContent(article.fullContent).map((paragraph, index) => (
              <Text
                key={index}
                className="text-base font-pregular text-gray-700 mb-5 leading-7"
              >
                {paragraph}
              </Text>
            ))}
          </View>

          <View className="mb-8">
            <TouchableOpacity
              className="bg-secondary py-3.5 rounded-lg items-center shadow-sm"
              onPress={openSourceLink}
            >
              <View className="flex-row items-center">
                <Feather name="external-link" size={18} color="white" />
                <Text className="text-white font-pmedium ml-2">
                  Read the original Article
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mb-10">
            <TouchableOpacity
              className="bg-gray-100 py-4 rounded-lg items-center border border-gray-200"
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
