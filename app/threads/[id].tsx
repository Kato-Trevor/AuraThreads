import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { addResponseToDB, getPostFromDB } from "@/lib/appwrite/appwrite";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@/components/ToastProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import Response from "@/components/Response";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/Avatar";
import getSongById from "@/services/get-song";
import { Audio } from "expo-av";

export default function Thread() {
  const { user } = useGlobalContext();
  const { id: postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [response, setResponse] = useState<string>("");
  const [song, setSong] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const timeAgo = post?.$createdAt
    ? formatDistanceToNow(new Date(post.$createdAt), {
        addSuffix: true,
      })
    : "Unknown time";

  const fetchPost = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const fetchedPost = await getPostFromDB(`${postId}`);
      setPost(fetchedPost);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleRefresh = useCallback(() => {
    fetchPost(true);
  }, [fetchPost]);

  useEffect(() => {
    const fetchSong = async () => {
      if (post?.songId) {
        const song = await getSongById(post?.songId);
        setSong(song);
      }
    };
    fetchSong();
  }, [post?.songId]);

  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  const stopSound = async () => {
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

  const playSound = async () => {
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
    }
  };

  const createResponse = async () => {
    if (!response.trim()) return;

    try {
      await addResponseToDB(response, `${postId}`, user.$id);
      showToast("Response created successfully!", "success");
      setResponse("");
      handleRefresh();
      // Scroll to the bottom to see the new response
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error creating response:", error);
      showToast("Error creating response!", "error");
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={90}
    >
      {/* Post at the top */}
      <View className="flex-1">
        {post && (
          <View className="px-8 py-3 flex-column items-start gap-3 mb-2">
            <View className="flex-row items-center gap-2">
              <Avatar username={post.userId.username} />
              <View className="flex-column items-start gap-1">
                <Text className="text-gray-500">@{post.userId.username}</Text>
                {post.songId && (
                  <TouchableOpacity
                    onPress={() => {
                      isPlaying ? stopSound() : playSound();
                    }}
                  >
                    <View className="flex-row justify-start items-center">
                      <Feather
                        name={isPlaying ? "volume-2" : "volume-x"}
                        size={20}
                        color="black"
                      />
                      <Text className="text-xs text-gray-500 ml-1">
                        {song?.artist?.name} • {song?.title_short}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View>
              <Text className="text-lg text-gray-800">
                {post.content}
              </Text>
              <Text className="text-xs text-secondary">#{post.topic}</Text>
            </View>
            <Text className="text-xs text-gray-500 text-right">{timeAgo}</Text>
            <View className="h-[0.5px] bg-gray-200 w-full" />
          </View>
        )}

        {/* Responses in the middle */}
        <Text className="pl-4 mb-4">
          <Text className="text-base font-bold text-gray-600">
            {post?.responses?.length}
          </Text>{" "}
          <Text className="text-base text-gray-500"> Responses</Text>
        </Text>
        <View className="h-[0.5px] bg-gray-200 w-full" />

        {post?.responses?.length === 0 ? (
          <Text className="p-4 italic text-gray-500 text-center">
            No responses yet. Be the first to respond!
          </Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={post?.responses}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <Response response={item} />}
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingBottom: 16,
            }}
          />
        )}
      </View>

      {/* Input field at the bottom */}
      <View className="flex-row p-3 border-t border-gray-200 bg-white items-center">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base max-h-24"
          placeholder="Post a response"
          value={response}
          onChangeText={setResponse}
          multiline
        />
        <TouchableOpacity
          onPress={createResponse}
          className="ml-3 p-2"
          disabled={!response.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={response.trim() ? "#F032DA" : "#cccccc"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
