import { Text, View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const data = [
  { value: "Depression", count: 38 },
  { value: "Anxiety", count: 30 },
  { value: "PTSD", count: 28 },
  { value: "Bipolar Disorder", count: 25 },
  { value: "OCD", count: 33 },
  { value: "Schizophrenia", count: 18 },
  { value: "ADHD", count: 20 },
  { value: "Eating Disorders", count: 22 },
  { value: "Autism", count: 15 },
  { value: "Substance Abuse", count: 10 },
  { value: "Insomnia", count: 8 },
  { value: "Stress", count: 5 },
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