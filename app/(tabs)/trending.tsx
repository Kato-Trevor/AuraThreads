import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { topics } from "@/constants/constants";
import { getPostsByTopic } from "@/lib/appwrite/appwrite";
import { formatTopic } from "@/utils/stringHelpers";
import LoadingSpinner from "@/components/LoadingSpinner";

const trending = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedTopics, setGeneratedTopics] = useState<
    { value: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchTopicsWithCounts = async () => {
      setIsLoading(true);
      const result = await generateTopicsWithCounts(topics); 
      setGeneratedTopics(result); 
      setIsLoading(false); 
    };

    fetchTopicsWithCounts();
  }, []);

  const handleTagPress = (tag: any) => {
    setSelectedTag(tag.value);
    bottomSheetRef.current?.expand();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="m-10 items-center justify-center">
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={generatedTopics}
            disableRandomColor={false}
            onPress={handleTagPress}
          />
          <Text className="mt-20 text-gray-500 text-sm">
            Tap any word from the cloud
          </Text>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["25%", "50%"]}
          enablePanDownToClose={true}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            <Text className="text-lg font-bold">
              Popular solutions for {selectedTag}
            </Text>
            <Text className="mt-2 text-gray-500">
              Here are some popular solutions and resources for {selectedTag}.
              This is just dummy content for now.
            </Text>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default trending;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export const generateTopicsWithCounts = async (
  topics: string[]
): Promise<{ value: string; count: number }[]> => {
  const topicsWithCounts = await Promise.all(
    topics.map(async (topic) => {
      const formattedTopic = formatTopic(topic);
      const posts = await getPostsByTopic(formattedTopic);
      return {
        value: formattedTopic,
        count: posts?.length,
      };
    })
  );

  return topicsWithCounts;
};
