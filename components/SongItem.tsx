import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

interface SongItemProps {
  song: Song;
  isActive: boolean;
  onPress: (item: Song | null) => void;
}

const SongItem: React.FC<SongItemProps> = ({ song, isActive, onPress }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 rounded-lg mb-2 ${
        isActive ? "bg-gray-200" : "bg-gray-100"
      }`}
      onPress={() => {
        isActive ? onPress(null) : onPress(song);
      }}
      style={{ opacity: isActive ? 0.5 : 1 }}
    >
      <Image
        source={{ uri: song.album.cover_small }}
        className="w-12 h-12 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{song.title_short}</Text>
        <Text className="text-gray-500">{song.artist.name}</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color="#F032DA" />
      ) : (
        <Ionicons
          name={isActive ? "pause" : "play"}
          size={24}
          color={isActive ? "#F032DA" : "gray"}
        />
      )}
    </TouchableOpacity>
  );
};

export default SongItem;
