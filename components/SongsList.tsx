import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { searchSongs } from "@/services/search-songs";
import SongItem from "./SongItem";

interface SongListProps {
  selectedSong: Song | null;
  onSongSelect: (item: Song | null) => void;
}

const SongsList: React.FC<SongListProps> = ({ selectedSong, onSongSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Request audio permissions and set audio mode
    const setupAudio = async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    };

    setupAudio();
  }, []);

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

  const stopCurrentSound = async () => {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
    } catch (error) {
      console.log("Error stopping current sound:", error);
    } finally {
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  const handleSongSelect = useCallback(
    (song: Song | null) => {
      stopCurrentSound();
      onSongSelect(song);
    },
    [onSongSelect]
  );

  const playSound = async (song: Song) => {
    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.preview },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
        }
      });

      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
      setError("Could not play the song");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  const renderSong = ({ item }: { item: Song }) => (
    <SongItem
      song={item}
      onSelect={handleSongSelect}
      onPlay={playSound}
      onPause={stopCurrentSound}
      isLoading={isLoading}
      isSelected={item.id === selectedSong?.id}
      isPlaying={item.id === selectedSong?.id && isPlaying}
    />
  );

  return (
    <>
      <View className="flex-row items-center p-3 my-3 bg-white rounded-full shadow-sm border border-gray-300">
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={{
            fontSize: 14,
            color: "gray",
            paddingVertical: 0,
            lineHeight: 20,
            textAlignVertical: "center",
          }}
          placeholder="What song resonates with you?"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="font-pregular"
        />
      </View>
      {error && (
        <Text className="text-red-500 text-center font-pregular">{error}</Text>
      )}
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item: Song) => item.id.toString()}
      />
    </>
  );
};

export default SongsList;
