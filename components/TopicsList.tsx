import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TopicsListProps {
  topics: any;
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
}) => {
  return (
    <View className="flex-1">
      <Text className="text-lg font-bold mb-4">What's This Post About?</Text>
      <FlatList
        data={topics}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center ${
              selectedTopic === item.topic ? "bg-pink-500" : "bg-pink-100"
            }`}
            onPress={() => onSelectTopic(item.topic)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={selectedTopic === item.topic ? "white" : "#D1006B"}
            />
            <Text
              className={`font-pmedium ml-2 ${
                selectedTopic === item.topic ? "text-white" : "text-pink-900"
              }`}
            >
              {item.topic}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
      />
    </View>
  );
};

export default TopicsList;
