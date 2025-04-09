import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { getPostById, getResponseById } from "@/lib/appwrite/appwrite";
import { topics } from "@/constants/constants";
import { formatTopic } from "@/utils/stringHelpers";
import { MotiView, MotiText, AnimatePresence } from "moti";
import { Easing } from "react-native-reanimated";

type TagItem = {
  value: string;
  count: number;
  color?: string;
  x?: number;
  y?: number;
  size?: number;
  animationParams?: {
    translateX: number[];
    translateY: number[];
    duration: number;
    delay: number;
  };
};

type ContentItem = {
  id: string;
  content: string;
  type: "post" | "response";
};

// Generate a random color from a blue/purple palette
const getRandomColor = () => {
  const colors = [
    "#4F46E5",
    "#6366F1",
    "#818CF8",
    "#4338CA",
    "#6D28D9",
    "#7C3AED",
    "#8B5CF6",
    "#A78BFA",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate random animation parameters
const getRandomAnimation = (width: number, height: number) => {
  const translateXRange = Math.floor(width * 0.15);
  const translateYRange = Math.floor(height * 0.1);

  return {
    translateX: [
      Math.random() * translateXRange * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * translateXRange * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * translateXRange * (Math.random() > 0.5 ? 1 : -1),
    ],
    translateY: [
      Math.random() * translateYRange * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * translateYRange * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * translateYRange * (Math.random() > 0.5 ? 1 : -1),
    ],
    duration: 10000 + Math.random() * 10000,
    delay: Math.random() * 1000,
  };
};

const FloatingWordCloud = ({
  tags,
  onTagPress,
  width,
  height,
}: {
  tags: TagItem[];
  onTagPress: (tag: TagItem) => void;
  width: number;
  height: number;
}) => {
  const [preparedTags, setPreparedTags] = useState<TagItem[]>([]);

  useEffect(() => {
    const centerX = width / 2;
    // Move the center Y position to the top third of the screen
    const centerY = height * 0.25;
    const maxRadius = Math.min(width, height * 0.4) / 2 - 50;

    const sortedTags = [...tags].sort((a, b) => b.count - a.count);
    const maxCount = Math.max(...tags.map((t) => t.count));
    const placedWords: {
      left: number;
      top: number;
      width: number;
      height: number;
    }[] = [];

    const prepared = sortedTags.map((tag) => {
      const fontSize = 14 + (tag.count / maxCount) * (40 - 14);
      const wordWidth = tag.value.length * 0.6 * fontSize;
      const wordHeight = fontSize * 1.2;

      // Start angle from a random position to create more organic look
      let angle = Math.random() * Math.PI * 2;
      const angleStep = Math.PI / 18; // 10 degrees clockwise
      const b = 15; // Spiral spread factor
      const maxAttempts = 360;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const radius = b * Math.abs(angle); // Use absolute angle for consistent radius growth
        if (radius > maxRadius) break;

        const cx = centerX + radius * Math.cos(angle);
        const cy = centerY + radius * Math.sin(angle);
        const x = cx - wordWidth / 2;
        const y = cy - wordHeight / 2;

        if (
          x >= 0 &&
          x + wordWidth <= width &&
          y >= 0 &&
          y + wordHeight <= height * 0.5 // Limit to top half of the screen
        ) {
          const canPlace = !placedWords.some((placed) => {
            const newRect = {
              left: x,
              top: y,
              right: x + wordWidth,
              bottom: y + wordHeight,
            };
            const placedRect = {
              left: placed.left,
              top: placed.top,
              right: placed.left + placed.width,
              bottom: placed.top + placed.height,
            };
            return (
              newRect.left < placedRect.right &&
              newRect.right > placedRect.left &&
              newRect.top < placedRect.bottom &&
              newRect.bottom > placedRect.top
            );
          });

          if (canPlace) {
            placedWords.push({
              left: x,
              top: y,
              width: wordWidth,
              height: wordHeight,
            });
            return {
              ...tag,
              x,
              y,
              size: fontSize,
              color: getRandomColor(),
              animationParams: getRandomAnimation(width, height),
            };
          }
        }
        angle += angleStep; // Continue clockwise
      }

      // Fallback placement - place near the top
      console.warn(`Could not place word: ${tag.value}`);
      const x = centerX - wordWidth / 2;
      const y = Math.random() * height * 0.3; // Random position in top 30%
      placedWords.push({
        left: x,
        top: y,
        width: wordWidth,
        height: wordHeight,
      });
      return {
        ...tag,
        x,
        y,
        size: fontSize,
        color: getRandomColor(),
        animationParams: getRandomAnimation(width, height),
      };
    });

    setPreparedTags(prepared);
  }, [tags, width, height]);

  return (
    <View style={[styles.cloudContainer, { width, height }]}>
      {preparedTags.map((tag) => (
        <MotiView
          key={tag.value}
          style={[
            styles.tagItem,
            {
              left: tag.x,
              top: tag.y,
            },
          ]}
          from={{
            translateX: 0,
            translateY: 0,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            translateX: tag.animationParams?.translateX,
            translateY: tag.animationParams?.translateY,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "timing",
            duration: tag.animationParams?.duration,
            easing: Easing.inOut(Easing.sin),
            loop: true,
            repeatReverse: true,
            delay: tag.animationParams?.delay,
          }}
        >
          <Text
            style={[
              styles.tagText,
              {
                fontSize: tag.size,
                color: tag.color,
              },
            ]}
            onPress={() => onTagPress(tag)}
          >
            {tag.value}
          </Text>
        </MotiView>
      ))}
    </View>
  );
};

const WordCloud = () => {
  const { height, width } = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState({
    tags: true,
    content: false,
  });
  const [tags, setTags] = useState<TagItem[]>([]);
  const [allTags, setAllTags] = useState<TagItem[]>([]);

  const snapPoints = useMemo(() => ["45%", "80%"], []);

  const mockData = {
    posts: [
      { $id: "67eab8e20039505af549", topic: "ExamAnxiety" },
      { $id: "67eab5a400189f496785", topic: "Loneliness" },
      { $id: "67e94ebf002486771cfc", topic: "CampusLife" },
      { $id: "67e82ade00131e7d7efc", topic: "Burnout" },
      { $id: "67e58d86000469718873", topic: "MentalHealth" },
      { $id: "67e58d0d001ae1a867cd", topic: "SocialPressure" },
      { $id: "67e5840e000e7a7a936b", topic: "RoommateIssues" },
      { $id: "67e57cea0028a2116d8c", topic: "CareerUncertainty" },
      { $id: "67e3d1480037f5c8d935", topic: "SocialPressure" },
      { $id: "67e3d0fa002c389666a0", topic: "TimeManagement" },
    ],
    responses: [
      { $id: "67eb8aaa003b497fa712", topic: "RoommateIssues" },
      { $id: "67eb8a70000505ece74b", topic: "MentalHealth" },
      { $id: "67eb8a68003869ca4b20", topic: "MentalHealth" },
      { $id: "67eb8a1c001145a53af6", topic: "Burnout" },
      { $id: "67eb89ec001b007d471c", topic: "CampusLife" },
      { $id: "67eb89e900101be07492", topic: "CampusLife" },
      { $id: "67eb872b002aa77afb90", topic: "Loneliness" },
      { $id: "67eb86f30014223bbbea", topic: "ExamAnxiety" },
      { $id: "67eb856c002167f83d36", topic: "ExamAnxiety" },
      { $id: "67eb854f002c3444ba14", topic: "ExamAnxiety" },
    ],
  };

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const allPossibleTags = topics.map((topic) => ({
          value: formatTopic(topic.topic),
          count: 0,
        }));

        setAllTags(allPossibleTags);

        const tagMap = new Map<string, number>();

        allPossibleTags.forEach((tag) => {
          tagMap.set(tag.value, 0);
        });

        mockData.posts.forEach((post) => {
          tagMap.set(post.topic, (tagMap.get(post.topic) || 0) + 1);
        });

        mockData.responses.forEach((response) => {
          tagMap.set(response.topic, (tagMap.get(response.topic) || 0) + 1);
        });

        const tagsWithCounts = Array.from(tagMap.entries())
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count); // Sort by popularity

        setTags(tagsWithCounts);
        setAllTags(tagsWithCounts);
      } catch (error) {
        console.error("Error fetching tag data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, tags: false }));
      }
    };

    fetchTagData();
  }, []);

  const handleTagPress = async (tag: TagItem) => {
    setSelectedTag(tag.value);
    setLoading((prev) => ({ ...prev, content: true }));
    setContentItems([]);

    try {
      const filteredPosts = mockData.posts.filter(
        (post) => post.topic === tag.value
      );
      const filteredResponses = mockData.responses.filter(
        (response) => response.topic === tag.value
      );

      const postPromises: Promise<ContentItem | null>[] = filteredPosts.map(
        async (post) => {
          try {
            const postData = await getPostById(post.$id);
            return {
              id: post.$id,
              content: postData.content,
              type: "post" as const,
            };
          } catch (error) {
            console.warn(`Failed to fetch post ${post.$id}:`, error);
            return null;
          }
        }
      );

      const responsePromises: Promise<ContentItem | null>[] =
        filteredResponses.map(async (response) => {
          try {
            const responseData = await getResponseById(response.$id);
            return {
              id: response.$id,
              content: responseData.content,
              type: "response" as const,
            };
          } catch (error) {
            console.warn(`Failed to fetch response ${response.$id}:`, error);
            return null;
          }
        });

      const [postsContent, responsesContent] = await Promise.all([
        Promise.all(postPromises),
        Promise.all(responsePromises),
      ]);

      const combinedContent = [
        ...postsContent.filter((item): item is ContentItem => item !== null),
        ...responsesContent.filter(
          (item): item is ContentItem => item !== null
        ),
      ];

      setContentItems(combinedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading((prev) => ({ ...prev, content: false }));
      bottomSheetRef.current?.expand();
    }
  };

  const renderItemLabel = (item: ContentItem) => {
    return item.type === "post" ? "Student Post" : "Peer Response";
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        {loading.tags ? (
          <MotiView
            style={styles.loadingContainer}
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <ActivityIndicator size="large" color="#6366f1" />
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
              style={styles.loadingText}
            >
              Gathering topics...
            </MotiText>
          </MotiView>
        ) : (
          <View style={styles.mainContainer}>
            <FloatingWordCloud
              tags={allTags}
              onTagPress={handleTagPress}
              width={width}
              height={height * 0.8}
            />

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 300 }}
              style={styles.helpTextContainer}
            >
              <Text style={styles.helpText}>Tap any word to explore</Text>
            </MotiView>
          </View>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          backgroundStyle={styles.bottomSheetBackground}
          animateOnMount
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            {loading.content ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>
                  Loading shared experiences...
                </Text>
              </View>
            ) : (
              <AnimatePresence>
                {contentItems.length > 0 ? (
                  <>
                    <MotiText
                      from={{ opacity: 0, translateY: 10 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0, translateY: -10 }}
                      style={styles.contentTitle}
                    >
                      {selectedTag} Experiences
                    </MotiText>

                    {contentItems.map((item, index) => (
                      <MotiView
                        key={item.id}
                        from={{ opacity: 0, translateY: 20, scale: 0.95 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        transition={{
                          type: "timing",
                          duration: 400,
                          delay: index * 80,
                          easing: Easing.out(Easing.ease),
                        }}
                        exit={{ opacity: 0, translateY: -20 }}
                        style={styles.contentCard}
                      >
                        <View
                          style={[
                            styles.contentCardHeader,
                            item.type === "post"
                              ? styles.postHeader
                              : styles.responseHeader,
                          ]}
                        >
                          <Text style={styles.contentCardLabel}>
                            {renderItemLabel(item)}
                          </Text>
                        </View>
                        <Text style={styles.contentCardText}>
                          {item.content}
                        </Text>
                      </MotiView>
                    ))}
                  </>
                ) : selectedTag ? (
                  <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "timing", duration: 400 }}
                    style={styles.emptyStateContainer}
                  >
                    <Text style={styles.emptyStateText}>
                      No shared experiences found for "{selectedTag}"
                    </Text>
                  </MotiView>
                ) : (
                  <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "timing", duration: 400 }}
                    style={styles.emptyStateContainer}
                  >
                    <Text style={styles.emptyStateText}>
                      Select a tag from the word cloud to view shared
                      experiences
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default WordCloud;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  safeContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  cloudContainer: {
    position: "relative",
  },
  tagItem: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  helpTextContainer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
  },
  helpText: {
    fontSize: 16,
    color: "#6b7280",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomSheetBackground: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  bottomSheetIndicator: {
    backgroundColor: "#d1d5db",
    width: 50,
    height: 5,
    borderRadius: 5,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  contentCard: {
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  contentCardHeader: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  postHeader: {
    backgroundColor: "#6366f1",
  },
  responseHeader: {
    backgroundColor: "#10b981",
  },
  contentCardLabel: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  contentCardText: {
    padding: 16,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
    lineHeight: 24,
  },
});
