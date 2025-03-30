import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface TopicsListProps {
  topics: string[];
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
            className={`py-2 px-4 rounded-lg mb-2 ${
              selectedTopic === item ? "bg-secondary" : "bg-gray-200"
            }`}
            onPress={() => onSelectTopic(item)}
          >
            <Text
              className={`text-lg ${
                selectedTopic === item ? "text-white" : "text-black"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default TopicsList;