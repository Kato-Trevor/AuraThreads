import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import {
  getExperiencePostsByTopic,
  getExperienceResponsesByTopic,
  getPostsByTopic,
} from "@/lib/appwrite/appwrite";
import { formatTopic } from "@/utils/stringHelpers";
import { topics } from "@/constants/constants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useToast } from "./ToastProvider";

type TagItem = {
  value: string;
  count: number;
};

type ContentItem = {
  id: string;
  content: string;
};

const { width } = Dimensions.get("window");

const WordCloud = () => {
  const { showToast } = useToast();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState({
    topics: false,
    content: false,
    error: false,
  });
  const [tags, setTags] = useState<TagItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isExperiencesVisible, setIsExperiencesVisible] = useState(false);

  const fetchTopicCounts = async (topic: string) => {
    try {
      const posts = await getPostsByTopic(topic);
      return posts.length;
    } catch (error) {
      console.error(`Error fetching posts for topic ${topic}:`, error);
      return 0;
    }
  };

  useEffect(() => {
    const loadTopicCounts = async () => {
      try {
        setLoading((prev) => ({ ...prev, topics: true }));

        const topicsWithCounts = await Promise.all(
          topics.map(async (topic) => {
            const count = await fetchTopicCounts(formatTopic(topic));
            return {
              value: formatTopic(topic),
              count: count,
            };
          })
        );

        setTags(topicsWithCounts);
      } catch (error) {
        console.error("Error loading topic counts:", error);
        setTags(
          topics.map((topic) => ({ value: formatTopic(topic), count: 1 }))
        );
      } finally {
        setLoading((prev) => ({ ...prev, topics: false }));
      }
    };

    loadTopicCounts();
  }, [topics]);

  const refreshTopics = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, topics: true }));

      const topicsWithCounts = await Promise.all(
        topics.map(async (topic) => {
          const count = await fetchTopicCounts(formatTopic(topic));
          return {
            value: formatTopic(topic),
            count: Math.max(count, 1), // Ensure minimum count of 1
          };
        })
      );

      setTags(topicsWithCounts);
    } catch (error) {
      console.error("Error refreshing topics:", error);
      // Fallback to default counts
      setTags(
        topics.map((topic) => ({
          value: formatTopic(topic),
          count: 1,
        }))
      );
    } finally {
      setLoading((prev) => ({ ...prev, topics: false }));
    }
  }, []);

  const fetchContent = async (tagValue: string) => {
    try {
      const [posts, responses] = await Promise.all([
        getExperiencePostsByTopic(tagValue).catch(() => []),
        getExperienceResponsesByTopic(tagValue).catch(() => []),
      ]);

      const combinedContent = [
        ...posts.map((post) => ({
          id: post.$id,
          content: post.content,
        })),
        ...responses.map((response) => ({
          id: response.$id,
          content: response.content,
        })),
      ];

      if (combinedContent.length === 0) {
        setLoading((prev) => ({ ...prev, error: true }));
      }

      setContentItems(combinedContent);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setLoading((prev) => ({ ...prev, error: true }));
    }
  };

  const handleTagPress = async (tag: { value: string }) => {
    try {
      setSelectedTag(tag.value);
      setLoading((prev) => ({ ...prev, content: true, error: false }));
      setIsExperiencesVisible(true);
      setContentItems([]);
      await fetchContent(tag.value);
      setLoading((prev) => ({ ...prev, content: false }));
    } catch (error) {
      showToast("Failed to fetch content", "error");
      setLoading((prev) => ({ ...prev, content: false, error: true }));
      setSelectedTag(null);
      setContentItems([]);
      setIsExperiencesVisible(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!selectedTag) return;

    setRefreshing(true);
    await fetchContent(selectedTag);
    setRefreshing(false);
  }, [selectedTag]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text className="text-xl font-pbold text-gray-900">
        Shared Experiences:
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        className="p-2 rounded-full bg-secondary-dark/10"
        disabled={loading.topics}
      >
        <Feather name="refresh-ccw" size={15} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading.content) {
      return (
        <View className="justify-center items-center p-8">
          <ActivityIndicator color="#295f48" />
          <Text className="font-pregular mt-4 text-secondary text-center">
            Fetching shared experiences...
          </Text>
        </View>
      );
    }

    if (loading.error) {
      return (
        <View className="justify-center items-center p-8">
          <View className="bg-secondary-100/30 p-4 rounded-full">
            <Feather name="message-circle" size={36} color="#1e4635" />
          </View>
          <Text className="font-pregular mt-4 text-secondary-dark text-center">
            No experiences found under this topic
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.mainContainer}>
        <View style={styles.cloudContainer}>
          {loading.topics ? (
            <View className="justify-center items-center p-8">
              <ActivityIndicator color="#588b76" />
              <Text className="font-pregular mt-4 text-secondary text-center">
                Fetching topics...
              </Text>
            </View>
          ) : (
            <TagCloud
              minSize={16}
              maxSize={36}
              tags={tags}
              disableRandomColor={false}
              onPress={handleTagPress}
              style={styles.tagCloud}
            />
          )}
          <Text style={styles.instructionText}>
            Tap any topic from the cloud
          </Text>
        </View>

        <TouchableOpacity
          onPress={refreshTopics}
          className="mt-5 p-2 rounded-full bg-secondary-dark/10"
          disabled={loading.topics}
        >
          <Feather name="refresh-ccw" size={24} color="black" />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isExperiencesVisible}
        >
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={25}
              tint="dark"
              style={StyleSheet.absoluteFill}
            >
              <View className="flex-1 bg-black/30" />
            </BlurView>
            <View className="flex-1 justify-end">
              <View
                className="bg-white rounded-t-3xl shadow-2xl"
                style={{ maxHeight: "70%" }}
              >
                {/* Header */}
                <View className="bg-gradient-to-r from-violet-50 to-indigo-50 pt-1.5 rounded-t-3xl">
                  <View className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-1.5" />
                  <View className="flex-row justify-between items-center px-6 py-4">
                    <Text className="text-xl font-pbold text-gray-900">
                      Shared Experiences:
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsExperiencesVisible(false);
                        setSelectedTag(null);
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

                {/* Content */}
                <View className="max-h-[70vh]">
                  <FlatList
                    data={contentItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.contentItem}>
                        <Text style={styles.contentText}>{item.content}</Text>
                      </View>
                    )}
                    ListEmptyComponent={renderEmptyComponent()}
                    refreshing={refreshing}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
  },
  cloudContainer: {
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  tagCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  instructionText: {
    marginTop: 50,
    color: "gray",
    fontSize: 14,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentItem: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f7f9f8",
    borderRadius: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
});

export default WordCloud;
