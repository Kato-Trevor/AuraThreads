import { songs } from "@/mocks/mock-data";
import React, { useEffect, useState } from "react";
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
import { searchSongs } from "@/services/search-songs";
import SongItem from "./SongItem";

const SongsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Debounce logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const result = await searchSongs(searchQuery);
      setSongs(result.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch songs. Please try again.");
    }
  };

  const renderSong = ({ item }: { item: Song }) => (
    <SongItem
      song={item}
      onPress={setSelectedSong}
      isActive={item.id === selectedSong?.id}
    />
  );

  return (
    <>
      <View className="flex-row items-center p-2 my-2 bg-[#E7ECF0] rounded-lg">
        <Ionicons name="search" size={24} color="gray" className="mr-2" />
        <TextInput
          className="flex-1 text-lg"
          placeholder="What song resonates with you?"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {error && <Text className="text-red-500 text-center">{error}</Text>}
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item: Song) => item.id.toString()}
      />
    </>
  );
};

export default SongsList;
