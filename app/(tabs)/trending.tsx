import { Text, View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const data = [
  { value: "JavaScript", count: 38 },
  { value: "React", count: 30 },
  { value: "Nodejs", count: 28 },
  { value: "Express.js", count: 25 },
  { value: "HTML5", count: 33 },
  { value: "MongoDB", count: 18 },
  { value: "CSS3", count: 20 },
  { value: "TypeScript", count: 22 },
  { value: "Python", count: 15 },
  { value: "AWS", count: 10 },
  { value: "Firebase", count: 8 },
  { value: "Docker", count: 5 },
];

const trending = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagPress = (tag: any) => {
    setSelectedTag(tag.value);
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="m-10 items-center justify-center">
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={data}
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