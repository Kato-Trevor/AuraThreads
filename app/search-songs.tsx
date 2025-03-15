import { songs } from "@/mocks/mock-data";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchSongs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const renderSong = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-gray-100 rounded-lg mb-2">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-12 h-12 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.title}</Text>
        <Text className="text-gray-500">{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="flex-row items-center p-3 mb-4 bg-[#E7ECF0] rounded-lg">
        <Ionicons name="search" size={24} color="gray" className="mr-2" />
        <TextInput
          className="flex-1 text-lg"
          placeholder="Search for a song"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default SearchSongs;
