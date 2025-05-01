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
    await refreshTopics();
    setRefreshing(false);
  }, [selectedTag]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.bottomSheetTitle}>Shared Experiences:</Text>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading.content) {
      return <ActivityIndicator size="large" style={styles.emptyContainer} />;
    }

    if (loading.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No experiences found yet for {selectedTag}
          </Text>
        </View>
      );
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1">
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
              Tap any word from the cloud
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
              onRefresh={onRefresh}
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
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  contentText: {
    fontSize: 14,
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

// import React, { useRef, useState, useEffect, useCallback } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import {
//   getExperiencePostsByTopic,
//   getExperienceResponsesByTopic,
//   getPostsByTopic,
// } from "@/lib/appwrite/appwrite";
// import { formatTopic } from "@/utils/stringHelpers";
// import { topics } from "@/constants/constants";
// import Feather from "@expo/vector-icons/Feather";

// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const { width } = Dimensions.get("window");

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     content: false,
//     error: false,
//     tags: false,
//   });
//   const [refreshing, setRefreshing] = useState(false);
//   const [tags, setTags] = useState<TagItem[]>([]);

//   const fetchTopicCounts = async (topic: string) => {
//     try {
//       const posts = await getPostsByTopic(topic);
//       return posts.length;
//     } catch (error) {
//       console.error(`Error fetching posts for topic ${topic}:`, error);
//       return 0;
//     }
//   };

//   useEffect(() => {
//     const loadTopicCounts = async () => {
//       try {
//         setLoading((prev) => ({ ...prev, tags: true }));

//         const topicsWithCounts = await Promise.all(
//           topics.map(async (topic) => {
//             const count = await fetchTopicCounts(formatTopic(topic));
//             return {
//               value: formatTopic(topic),
//               count: count,
//             };
//           })
//         );

//         setTags(topicsWithCounts);
//       } catch (error) {
//         console.error("Error loading topic counts:", error);
//         setTags(
//           topics.map((topic) => ({ value: formatTopic(topic), count: 1 }))
//         );
//       } finally {
//         setLoading((prev) => ({ ...prev, tags: false }));
//       }
//     };

//     loadTopicCounts();
//   }, [topics]);

//   // Function to fetch experiences for a given tag value.
//   const fetchExperiences = async (tagValue: string) => {
//     setLoading((prev) => ({ ...prev, content: true, error: false }));
//     setContentItems([]);
//     try {
//       const [posts, responses] = await Promise.all([
//         getExperiencePostsByTopic(tagValue).catch(() => []),
//         getExperienceResponsesByTopic(tagValue).catch(() => []),
//       ]);

//       const combinedContent = [
//         ...posts.map((post) => ({
//           id: post.$id,
//           content: post.content,
//         })),
//         ...responses.map((response) => ({
//           id: response.$id,
//           content: response.content,
//         })),
//       ];

//       if (combinedContent.length === 0) {
//         setLoading((prev) => ({ ...prev, error: true }));
//       }

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//       setLoading((prev) => ({ ...prev, error: true }));
//     } finally {
//       setLoading((prev) => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   // Called when a tag in the cloud is pressed.
//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     await fetchExperiences(tag.value);
//   };

//   const refreshTopics = useCallback(async () => {
//     try {
//       setLoading((prev) => ({ ...prev, tags: true }));

//       const topicsWithCounts = await Promise.all(
//         topics.map(async (topic) => {
//           const count = await fetchTopicCounts(formatTopic(topic));
//           return {
//             value: formatTopic(topic),
//             count: Math.max(count, 1), // Ensure minimum count of 1
//           };
//         })
//       );

//       setTags(topicsWithCounts);
//     } catch (error) {
//       console.error("Error refreshing topics:", error);
//       // Fallback to default counts
//       setTags(
//         topics.map((topic) => ({
//           value: formatTopic(topic),
//           count: 1,
//         }))
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, tags: false }));
//     }
//   }, []);

//   // Called when the user pulls to refresh.
//   const refreshExperiences = async () => {
//     if (!selectedTag) return;
//     setRefreshing(true);
//     try {
//       await Promise.all([fetchExperiences(selectedTag), refreshTopics()]);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // function to refresh the tags

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaView style={{ flex: 1 }}>
//         <View style={styles.mainContainer}>
//           {loading.tags ? (
//             <View className="justify-center items-center p-8">
//               <ActivityIndicator color="#1e4635" />
//               <Text className="font-pregular mt-4 text-secondary-dark text-center">
//                 Fetching topics...
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.cloudContainer}>
//               <TagCloud
//                 minSize={16}
//                 maxSize={36}
//                 tags={tags}
//                 disableRandomColor={false}
//                 onPress={handleTagPress}
//                 style={styles.tagCloud}
//               />
//               <Text style={styles.instructionText}>
//                 Tap any word from the cloud
//               </Text>
//             </View>
//           )}

//           <TouchableOpacity
//             onPress={refreshTopics}
//             style={styles.refreshButton}
//             disabled={loading.tags}
//           >
//             <Feather name="refresh-ccw" size={24} color="black" />
//           </TouchableOpacity>

//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={["40%", "75%"]}
//             enablePanDownToClose={true}
//           >
//             <BottomSheetScrollView
//               contentContainerStyle={styles.contentContainer}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={refreshing}
//                   onRefresh={refreshExperiences}
//                 />
//               }
//             >
//               <Text style={styles.bottomSheetTitle}>Shared Experiences:</Text>

//               {loading.content ? (
//                 <ActivityIndicator size="large" />
//               ) : loading.error ? (
//                 <View style={styles.errorContainer}>
//                   <Text style={styles.errorText}>
//                     No experiences found yet for {selectedTag}
//                   </Text>
//                 </View>
//               ) : contentItems.length > 0 ? (
//                 contentItems.map((item) => (
//                   <View key={item.id} style={styles.contentItem}>
//                     <Text style={styles.contentText}>{item.content}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.emptyText}>
//                   Select a tag to view shared experiences
//                 </Text>
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </View>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     alignItems: "center",
//     paddingTop: 20,
//   },
//   cloudContainer: {
//     width: width * 0.9,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 20,
//   },
//   tagCloud: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   instructionText: {
//     marginTop: 8,
//     color: "gray",
//     fontSize: 14,
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   errorContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   errorText: {
//     color: "gray",
//     marginBottom: 8,
//   },
//   contentItem: {
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//   },
//   contentText: {
//     fontSize: 14,
//   },
//   emptyText: {
//     color: "gray",
//   },
//   refreshButton: {
//     marginTop: 20,
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: "rgba(30, 70, 53, 0.1)",
//   },
// });

// export default WordCloud;
