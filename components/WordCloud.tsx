import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  getExperiencePostsByTopic,
  getExperienceResponsesByTopic,
  getPostsByTopic,
} from "@/lib/appwrite/appwrite";
import { formatTopic } from "@/utils/stringHelpers";
import { topics } from "@/constants/constants";
import { Feather } from "@expo/vector-icons";

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
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const snapPoints = useMemo(() => ["75%"], []);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState({
    topics: false,
    content: false,
    error: false,
  });
  const [tags, setTags] = useState<TagItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    setSelectedTag(tag.value);
    setLoading((prev) => ({ ...prev, content: true, error: false }));
    setContentItems([]);

    await fetchContent(tag.value);

    setLoading((prev) => ({ ...prev, content: false }));
    bottomSheetRef.current?.snapToIndex(1);
  };

  const onRefresh = useCallback(async () => {
    if (!selectedTag) return;

    setRefreshing(true);
    await fetchContent(selectedTag);
    setRefreshing(false);
  }, [selectedTag]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text className="text-xl font-pbold text-gray-900">Shared Experiences:</Text>
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
      return <ActivityIndicator size="large" style={styles.emptyContainer} />;
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
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <View style={styles.mainContainer}>
          <View style={styles.cloudContainer}>
            {loading.topics ? (
              <View className="justify-center items-center p-8">
                <ActivityIndicator color="#1e4635" />
                <Text className="font-pregular mt-4 text-secondary-dark text-center">
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

          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose
          >
            <BottomSheetFlatList
              data={contentItems}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader()}
              ListEmptyComponent={renderEmptyComponent()}
              renderItem={({ item }) => (
                <View style={styles.contentItem}>
                  <Text style={styles.contentText}>{item.content}</Text>
                </View>
              )}
              refreshing={refreshing}
              contentContainerStyle={styles.listContentContainer}
            />
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "gray",
    marginBottom: 8,
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
    fontFamily: 'Poppins-Regular',
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    padding: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});

export default WordCloud;
