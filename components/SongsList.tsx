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

  const handleSongSelect = useCallback((song: Song | null) => {
    stopCurrentSound();
    onSongSelect(song);
  }, [onSongSelect]);

  // Play sound function
  const playSound = async (song: Song) => {
    try {
      // Create and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.preview },
        { shouldPlay: true }
      );

      // Set up playback status listener
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
      onSelect={handleSongSelect}
      onPlay={playSound}
      onPause={stopCurrentSound}
      isSelected={item.id === selectedSong?.id}
      isPlaying={item.id === selectedSong?.id && isPlaying}
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