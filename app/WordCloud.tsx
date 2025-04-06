import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { getPostById, getResponseById } from "@/lib/appwrite/appwrite";
import { topics } from "@/constants/constants";
import { formatTopic } from "@/utils/stringHelpers";

type TagItem = {
  value: string;
  count: number;
};

type ContentItem = {
  id: string;
  content: string;
};

const WordCloud = () => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState({
    tags: true,
    content: false
  });
  const [tags, setTags] = useState<TagItem[]>([]);
  const [allTags, setAllTags] = useState<TagItem[]>([]);

  const mockData = {
    posts : [
      {
        "$id": "67ecc41d00260a830244",
        "topic": "Motivation"
      },
      {
        "$id": "67ecc3eb003e245957d8",
        "topic": "Burnout"
      },
      {
        "$id": "67ecbfbf001f1d092030",
        "topic": "Self-Harm"
      },
      {
        "$id": "67ec41ff0009fe93eea2",
        "topic": "Stress"
      },
      {
        "$id": "67ec2d490022801ef335",
        "topic": "SocialPressure"
      },
      {
        "$id": "67ec29f80034e191e653",
        "topic": "Confidence"
      },
      {
        "$id": "67eab8e20039505af549",
        "topic": "Anxiety"
      },
      {
        "$id": "67eab5a400189f496785",
        "topic": "Loneliness"
      },
      {
        "$id": "67e94ebf002486771cfc",
        "topic": "Confidence"
      },
      {
        "$id": "67e82ade00131e7d7efc",
        "topic": "Burnout"
      }
    ],
    responses : [
      {
        "$id": "67ecbef600103938dc76",
        "topic": "Stress"
      },
      {
        "$id": "67eb8aaa003b497fa712",
        "topic": "Sleep"
      },
      {
        "$id": "67eb8a70000505ece74b",
        "topic": "Trauma"
      },
      {
        "$id": "67eb8a68003869ca4b20",
        "topic": "Grief"
      },
      {
        "$id": "67eb8a1c001145a53af6",
        "topic": "Burnout"
      },
      {
        "$id": "67eb89ec001b007d471c",
        "topic": "Social Pressure"
      },
      {
        "$id": "67eb89e900101be07492",
        "topic": "Fear"
      },
      {
        "$id": "67eb872b002aa77afb90",
        "topic": "Loneliness"
      },
      {
        "$id": "67eb86f30014223bbbea",
        "topic": "Focus"
      },
      {
        "$id": "67eb856c002167f83d36",
        "topic": "Addiction"
      }
    ]
  };

  useEffect(() => {
    const allPossibleTags = topics.map(topic => ({
      value: formatTopic(topic),
      count: 0
    }));

    setAllTags(allPossibleTags);

    const tagMap = new Map<string, number>();

    allPossibleTags.forEach(tag => {
      tagMap.set(tag.value, 0);
    });

    mockData.posts.forEach(post => {
      tagMap.set(post.topic, (tagMap.get(post.topic) || 0) + 1);
    });

    mockData.responses.forEach(response => {
      tagMap.set(response.topic, (tagMap.get(response.topic) || 0 + 1))
    });

    const tagsWithCounts = Array.from(tagMap.entries()).map(([value, count]) => ({ value, count }));
    setTags(tagsWithCounts);
    setAllTags(tagsWithCounts);
    setLoading(prev => ({ ...prev, tags: false }));
  }, []);

  const handleTagPress = async (tag: { value: string }) => {
    setSelectedTag(tag.value);
    setLoading(prev => ({ ...prev, content: true }));
    setContentItems([]);

    try {
      const filteredPosts = mockData.posts.filter(post => post.topic === tag.value);
      const filteredResponses = mockData.responses.filter(response => response.topic === tag.value);

      const postPromises: Promise<ContentItem | null>[] = filteredPosts.map(async post => {
        try {
          const postData = await getPostById(post.$id);
          return {
            id: post.$id,
            content: postData.content,
            type: 'post' as const
          };
        } catch (error) {
          console.warn(`Failed to fetch post ${post.$id}:`, error);
          return null;
        }
      });

      const responsePromises: Promise<ContentItem | null>[] = filteredResponses.map(async response => {
        try {
          const responseData = await getResponseById(response.$id);
          return {
            id: response.$id,
            content: responseData.content,
            type: 'response' as const
          };
        } catch (error) {
          console.warn(`Failed to fetch response ${response.$id}:`, error);
          return null;
        }
      });

      const [postsContent, responsesContent] = await Promise.all([
        Promise.all(postPromises),
        Promise.all(responsePromises)
      ]);

      const combinedContent = [
        ...postsContent.filter((item): item is ContentItem => item !== null),
        ...responsesContent.filter((item): item is ContentItem => item !== null)
      ];

      setContentItems(combinedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
      bottomSheetRef.current?.expand();
    }
  };

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        {loading.tags ? (
          <View className="flex-1 justify-center items-center ">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <View className="m-10 items-center justify-center ">
              <TagCloud
                minSize={12}
                maxSize={35}
                tags={allTags}   
                disableRandomColor={false}
                onPress={handleTagPress}
                shuffle={false}
              />
              <Text className="mt-20 text-gray-500 text-sm">
                Tap any word from the cloud
              </Text>
            </View>

            <BottomSheet
              ref={bottomSheetRef}
              index={-1}
              snapPoints={["40%", "75%"]}
              enablePanDownToClose={true}
            >
              <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                <Text className="text-lg font-bold mb-4">
                Overcoming Challenges
                </Text>

                {loading.content ? (
                  <ActivityIndicator size="large" />
                ) : contentItems.length > 0 ? (
                  contentItems.map((item) => (
                    <View key={item.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <Text className="text-sm">{item.content}</Text>
                    </View>
                  ))
                ) : selectedTag ? (
                  <Text className="text-gray-500">
                    No shared experiences found for {selectedTag}
                  </Text>
                ) : (
                  <Text className="text-gray-500">
                    Select a tag to view shared experiences
                  </Text>
                )}
              </BottomSheetScrollView>
            </BottomSheet>
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default WordCloud;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
});




