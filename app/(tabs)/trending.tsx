import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import WordCloud from "@/components/WordCloud";
import MoodAnalytics from "@/components/MoodAnalytics";

const Trending = () => {
  const [selectedTab, setSelectedTab] = useState("popular");

  return (
    <View className="flex-1">
      <View className="flex-row justify-around bg-white py-2.5">
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab("popular");
          }}
        >
          <Text
            className={
              selectedTab === "popular"
                ? "text-secondary font-pbold"
                : "text-gray-500 font-pregular"
            }
          >
            Popular
          </Text>
          {selectedTab === "popular" && (
            <View className="h-0.5 w-8 bg-green-600 mt-1" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab("forYou");
          }}
        >
          <Text
            className={
              selectedTab === "forYou"
                ? "text-secondary font-pbold"
                : "text-gray-500 font-pregular"
            }
          >
            For You
          </Text>
          {selectedTab === "forYou" && (
            <View className="h-0.5 w-8 bg-secondary mt-1" />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {selectedTab === "popular" ? <WordCloud /> : <MoodAnalytics />}
      </View>
    </View>
  );
};

export default Trending;
