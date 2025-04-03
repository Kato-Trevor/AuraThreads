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

  // Animation values for loading dots
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  // Handle animations when selection state changes
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

      // Only show play button if this item is actually selected
      Animated.spring(playButtonScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide play button when not selected
      Animated.timing(playButtonScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  // Animation for pulsing when playing
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

  // Better loading animation using three dots with sequential opacity changes
  useEffect(() => {
    if (isLoading) {
      // Animated dots sequence
      const animateDots = () => {
        Animated.sequence([
          // First dot
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),

          // Second dot
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),

          // Third dot
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isLoading) {
            animateDots();
          }
        });
      };

      animateDots();
    } else {
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
    }
    return () => {
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
      dot3Opacity.stopAnimation();
    };
  }, [isLoading]);

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
        isSelected
          ? "bg-pink-200 shadow-sm"
          : "bg-pink-50 border border-pink-50"
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
          <Text
            numberOfLines={1}
            className="text-base font-pbold text-pink-900"
          >
            {song.title_short}
          </Text>
          <Text numberOfLines={1} className="text-sm text-pink-800">
            {song.artist.name}
          </Text>

          <View className="flex-row items-center mt-1">
            {song.explicit_lyrics && (
              <View className="mr-2 px-1 bg-pink-300 rounded">
                <Text className="text-xs text-pink-700 font-pmedium">E</Text>
              </View>
            )}
            <Text className="text-xs text-pink-500">
              {song.album.title.length > 18
                ? song.album.title.substring(0, 15) + "..."
                : song.album.title}{" "}
              • {formatDuration(song.duration)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isSelected && (
        <Animated.View
          style={{
            transform: [{ scale: playButtonScale }],
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
                ? "bg-blue-50"
                : "bg-gray-100"
            }`}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <View className="flex-row items-center justify-center w-6 h-5">
                <Animated.View
                  style={{ opacity: dot1Opacity }}
                  className="w-1.5 h-1.5 rounded-full bg-pink-500 mx-0.5"
                />
                <Animated.View
                  style={{ opacity: dot2Opacity }}
                  className="w-1.5 h-1.5 rounded-full bg-pink-500 mx-0.5"
                />
                <Animated.View
                  style={{ opacity: dot3Opacity }}
                  className="w-1.5 h-1.5 rounded-full bg-pink-500 mx-0.5"
                />
              </View>
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={22}
                color={"#D1006B"}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default SongItem;
