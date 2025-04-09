import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
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
  const [username, setUsername] = useState("");

  const timeAgo = post?.$createdAt
    ? formatDistanceToNow(new Date(post.$createdAt), { addSuffix: true })
    : "Unknown time";

  const fetchPost = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) setIsRefreshing(true);
        else setIsLoading(true);

        const fetchedPost = await getPostFromDB(`${postId}`);
        setPost(fetchedPost);
        setLikeCount(
          fetchedPost.likes?.length || Math.floor(Math.random() * 20)
        );
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [postId]
  );

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
      if (currentSound) currentSound.unloadAsync();
    };
  }, [currentSound]);

  useEffect(() => {
    if (post?.userId.role === "student") {
      setUsername(
        post?.isAnonymous ? generateAnonymousUsername() : post?.userId.username
      );
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
    }
  };

  const createResponse = async () => {
    if (!response.trim()) return;
    try {
      await addResponseToDB(response, `${postId}`, user.$id, enableAnonymousID);
      showToast("Response created successfully!", "success");
      setResponse("");
      handleRefresh();
      if (flatListRef.current)
        flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error creating response:", error);
      showToast("Error creating response!", "error");
    }
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

  const ListHeader = () => (
    <View>
      {post && (
        <View className="p-4 bg-white border-b border-secondary/10">
          <View className="flex-row items-center mb-3">
            <Avatar username={username} />
            <View className="ml-3 flex-1">
              {post.userId.role === "counselor" ? (
                <Link
                  href={{
                    pathname: "/profile/[id]",
                    params: { id: `${post.userId.$id}` },
                  }}
                >
                  <Text className="font-psemibold text-secondary-darkest">
                    {username}
                  </Text>
                  <Text className="font-pregular text-xs text-secondary-dark opacity-70">
                    {post.userId.role}
                  </Text>
                </Link>
              ) : (
                <View>
                  <Text className="font-psemibold text-secondary-darkest">
                    @{username}
                  </Text>
                  <Text className="text-xs font-pregular text-secondary-dark opacity-70">
                    {post.userId.role}
                  </Text>
                </View>
              )}
            </View>
            <Text className="font-plight text-xs text-secondary/60 mr-2">
              {timeAgo}
            </Text>
            <TouchableOpacity className="p-1.5 bg-secondary/5 rounded-full">
              <Feather name="more-horizontal" size={18} color="#1e4635" />
            </TouchableOpacity>
          </View>
          <Text className="font-pregular text-base text-secondary-darkest leading-6 mb-3">
            {post.content}
          </Text>
          {post.topic && (
            <TouchableOpacity className="my-2">
              <Text className="font-pregular text-secondary font-medium text-sm">
                #{post.topic}
              </Text>
            </TouchableOpacity>
          )}
          {post.songId && song && (
            <TouchableOpacity
              onPress={() => (isPlaying ? stopSound() : playSound())}
              className="flex-row items-center mt-2 mb-3 bg-secondary-100/40 p-3 rounded-lg border border-secondary/10"
            >
              <View className="w-9 h-9 bg-secondary rounded-full justify-center items-center mr-3 shadow-sm">
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={18}
                  color="#ffffff"
                />
              </View>
              <View className="flex-1">
                <Text
                  className="font-pmedium text-secondary-darkest truncate"
                  numberOfLines={1}
                >
                  {song?.title_short}
                </Text>
                <Text
                  className="text-xs font-plight text-secondary-dark"
                  numberOfLines={1}
                >
                  {song?.artist?.name}
                </Text>
              </View>
              <View className="bg-secondary/10 p-1.5 rounded-full">
                <MaterialIcons
                  name={isPlaying ? "volume-up" : "volume-off"}
                  size={16}
                  color="#1e4635"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="font-psemibold text-secondary-dark">
          {post?.responses?.length || 0} Responses
        </Text>
        {post?.responses?.length > 0 && (
          <TouchableOpacity className="bg-secondary-200 py-1 px-3 rounded-full">
            <Text className="font-plight text-secondary-darkest text-xs font-medium">
              Sort by: Recent
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={90}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-secondary/10 bg-white">
          <TouchableOpacity
            onPress={handleBack}
            className="bg-secondary/5 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#1e4635" />
          </TouchableOpacity>
          <Text className="text-lg font-psemibold text-secondary-darkest">
            Thread
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={post?.responses}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <Response response={item} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View className="justify-center items-center p-8">
              <View className="bg-secondary-100/30 p-4 rounded-full">
                <Feather name="message-circle" size={36} color="#1e4635" />
              </View>
              <Text className="font-pregular mt-4 text-secondary-dark text-center">
                No responses yet. Be the first to respond!
              </Text>
            </View>
          }
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          keyboardShouldPersistTaps="handled"
        />

        <View className="flex-row p-3 border-t border-secondary/10 bg-white items-center">
          <Avatar username={user.username} imageUrl={user.avatar} />
          <TextInput
            className="font-pregular flex-1 bg-secondary-100/20 rounded-full px-4 py-2 text-base max-h-24 ml-2 text-secondary-darkest"
            placeholder="Add your response..."
            placeholderTextColor="#78a593"
            value={response}
            onChangeText={setResponse}
            multiline
          />
          <TouchableOpacity
            onPress={createResponse}
            className="ml-2 p-2.5 bg-secondary rounded-full"
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
