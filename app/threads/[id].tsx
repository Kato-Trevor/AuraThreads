import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { addResponseToDB, getPostFromDB } from "@/lib/appwrite/appwrite";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@/components/ToastProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import Response from "@/components/Response";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/Avatar";
import getSongById from "@/services/get-song";
import { Audio } from "expo-av";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";

export default function Thread() {
  const { user, enableAnonymousID } = useGlobalContext();
  const { id: postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [response, setResponse] = useState<string>("");
  const [song, setSong] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [username, setUsername] = useState('');

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

      // Initialize like count from post data (placeholder)
      setLikeCount(fetchedPost.likes?.length || Math.floor(Math.random() * 20));
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPost();
    StatusBar.setBarStyle("dark-content");
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

  useEffect(() => {
    if (post?.userId.role === "student") {
      if (post?.isAnonymous) {
        setUsername(generateAnonymousUsername());
      } else {
        setUsername(post?.userId.username);
      }
    } else {
      setUsername(`${post?.userId.surname} ${post?.userId.givenNames}`);
    }
  }, [post]);

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
      await addResponseToDB(response, `${postId}`, user.$id, enableAnonymousID);
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // Here you would add the actual API call to update likes in your backend
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
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
      <SafeAreaView className="flex-1">
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Thread</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Post at the top */}
        <View className="flex-1">
          {post && (
            <View className="p-4 bg-white border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <Avatar username={username} />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-800">
                    {username}
                  </Text>
                </View>
                <TouchableOpacity className="p-2">
                  <Feather name="more-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <Text className="text-lg text-gray-800 mb-2">{post.content}</Text>

              {post.topic && (
                <TouchableOpacity className="my-2">
                  <Text className="text-pink-500 text-sm">#{post.topic}</Text>
                </TouchableOpacity>
              )}

              {post.songId && song && (
                <TouchableOpacity
                  onPress={() => {
                    isPlaying ? stopSound() : playSound();
                  }}
                  className="flex-row items-center mt-1 mb-3 bg-gray-50 p-3 rounded-lg"
                >
                  <View className="w-10 h-10 bg-pink-100 rounded-md justify-center items-center mr-3">
                    <Feather
                      name={isPlaying ? "pause" : "play"}
                      size={20}
                      color="#F032DA"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {song?.title_short}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {song?.artist?.name}
                    </Text>
                  </View>
                  <Feather
                    name={isPlaying ? "volume-2" : "volume-x"}
                    size={18}
                    color="#888"
                  />
                </TouchableOpacity>
              )}

              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-sm text-gray-500">{timeAgo}</Text>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={handleLike}
                    className="flex-row items-center mr-4"
                  >
                    <MaterialIcons
                      name={isLiked ? "favorite" : "favorite-border"}
                      size={22}
                      color={isLiked ? "#F032DA" : "#666"}
                    />
                    {likeCount > 0 && (
                      <Text className="ml-1 text-sm text-gray-700">
                        {likeCount}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center">
                    <Feather name="share-2" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Responses header */}
          <View className="flex-row justify-between items-center px-4 py-3 bg-gray-50">
            <Text className="font-semibold text-gray-700">
              {post?.responses?.length || 0} Responses
            </Text>
            {post?.responses?.length > 0 && (
              <TouchableOpacity>
                <Text className="text-pink-500 text-sm">Sort by: Recent</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Responses list */}
          {post?.responses?.length === 0 ? (
            <View className="flex-1 justify-center items-center p-8">
              <Feather name="message-circle" size={40} color="#ccc" />
              <Text className="mt-4 text-gray-500 text-center">
                No responses yet. Be the first to respond!
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={post?.responses}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => <Response response={item} />}
              className="flex-1"
              contentContainerStyle={{
                paddingBottom: 16,
              }}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          )}
        </View>

        {/* Input field at the bottom */}
        <View className="flex-row p-3 border-t border-gray-200 bg-white items-center">
          <Avatar username={user.username} />
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base max-h-24 ml-2"
            placeholder="Add your response..."
            value={response}
            onChangeText={setResponse}
            multiline
          />
          <TouchableOpacity
            onPress={createResponse}
            className="ml-2 p-2 bg-pink-500 rounded-full"
            disabled={!response.trim()}
            style={{ opacity: response.trim() ? 1 : 0.5 }}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
