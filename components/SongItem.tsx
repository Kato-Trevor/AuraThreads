import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";

interface SongItemProps {
  song: Song;
  isSelected: boolean;
  isPlaying: boolean;
  isLoading?: boolean;
  onSelect: (item: Song | null) => void;
  onPlay: (item: Song) => void;
  onPause: () => void;
}

const SongItem: React.FC<SongItemProps> = ({
  song,
  isSelected,
  isPlaying,
  isLoading = false,
  onSelect,
  onPlay,
  onPause,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const playButtonScale = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.spring(playButtonScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(playButtonScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.85,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      opacityAnim.setValue(1);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const formatDuration = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: isSelected && !isPlaying ? 0.9 : opacityAnim,
      }}
      className={`flex-row items-center p-4 rounded-xl mb-3 ${
        isSelected ? "bg-gray-200 shadow-sm" : "bg-white border border-gray-100"
      }`}
    >
      <TouchableOpacity
        onPress={() => {
          isSelected ? onSelect(null) : onSelect(song);
        }}
        className="flex-row items-center flex-1"
        activeOpacity={0.7}
      >
        <View className="relative mr-4">
          <Image
            source={{ uri: song.album.cover_small }}
            className="w-14 h-14 rounded-lg"
          />
          {isPlaying && (
            <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
              <View className="w-2 h-2 rounded-full bg-white animate-pulse"></View>
            </View>
          )}
        </View>

        <View className="flex-1 justify-center">
          <Text numberOfLines={1} className="text-base font-bold text-gray-800">
            {song.title_short}
          </Text>
          <Text numberOfLines={1} className="text-sm text-gray-500">
            {song.artist.name}
          </Text>

          <View className="flex-row items-center mt-1">
            {song.explicit_lyrics && (
              <View className="mr-2 px-1 bg-gray-200 rounded">
                <Text className="text-xs text-gray-500 font-medium">E</Text>
              </View>
            )}
            <Text className="text-xs text-gray-400">
              {song.album.title.length > 18
                ? song.album.title.substring(0, 15) + "..."
                : song.album.title}{" "}
              • {formatDuration(song.duration)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          transform: [{ scale: isSelected ? playButtonScale : 0 }],
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (!isLoading) {
              isPlaying ? onPause() : onPlay(song);
            }
          }}
          className={`p-2 rounded-full ${
            isPlaying
              ? "bg-pink-100"
              : isLoading
              ? "bg-blue-100"
              : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="refresh" size={22} color="#3B82F6" />
            </Animated.View>
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={isPlaying ? "#F032DA" : "#444"}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default SongItem;
