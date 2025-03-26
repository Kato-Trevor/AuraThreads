import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { searchSongs } from "@/services/search-songs";
import SongItem from "./SongItem";

const SongsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleSongPress = useCallback(async (song: Song) => {
    try {
      // If the same song is pressed
      if (selectedSong?.id === song.id) {
        // If currently playing, stop the song
        if (isPlaying && currentSound) {
          await currentSound.stopAsync();
          setIsPlaying(false);
          setSelectedSong(null);
        } else {
          // If not playing, start the song
          await playSound(song);
        }
      } else {
        // If a different song is pressed
        // Stop the current song if it's playing
        if (currentSound) {
          await currentSound.stopAsync();
        }
        
        // Play the new song
        await playSound(song);
      }
    } catch (error) {
      console.error("Error handling song playback:", error);
    }
  }, [currentSound, isPlaying, selectedSong]);

  // Play sound function
  const playSound = async (song: Song) => {
    try {
      // Unload any existing sound
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      // Create and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.preview },
        { shouldPlay: true }
      );

      // Set up playback status listener
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
          setIsPlaying(false);
          setSelectedSong(null);
        }
      });

      setCurrentSound(sound);
      setSelectedSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
      setError("Could not play the song");
    }
  };

  // Cleanup sound on component unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  // Render song item
  const renderSong = ({ item }: { item: Song }) => (
    <SongItem
      song={item}
      onPress={() => handleSongPress(item)}
      isActive={item.id === selectedSong?.id && isPlaying}
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