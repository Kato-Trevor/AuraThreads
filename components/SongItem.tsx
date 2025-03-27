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
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: (item: Song | null) => void;
  onPlay: (item: Song) => void;
  onPause: () => void;
}

const SongItem: React.FC<SongItemProps> = ({
  song,
  isSelected,
  isPlaying,
  onSelect,
  onPlay,
  onPause,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View
      className={`flex-row items-center p-4 rounded-lg mb-2 ${
        isSelected ? "bg-gray-200" : "bg-gray-100"
      }`}
      style={{ opacity: isSelected ? 0.5 : 1 }}
    >
      <TouchableOpacity
        onPress={() => {
          isSelected ? onSelect(null) : onSelect(song);
        }}
        className="flex-row items-center flex-1"
      >
        <Image
          source={{ uri: song.album.cover_small }}
          className="w-12 h-12 rounded-lg mr-4"
        />
        <View>
          <Text className="text-lg font-semibold">{song.title_short}</Text>
          <Text className="text-gray-500">{song.artist.name}</Text>
        </View>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="small" color="#F032DA" />
      ) : (
        <TouchableOpacity
          onPress={() => {
            isPlaying ? onPause() : onPlay(song);
          }}
          className="ml-4"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color={isPlaying ? "#F032DA" : "gray"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SongItem;