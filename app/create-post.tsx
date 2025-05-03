import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import Avatar from "@/components/Avatar";
import { addPostToDB, addAIResponseToDB } from "@/lib/appwrite/appwrite";
import { formatTopic } from "@/lib/utils/stringHelpers";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { categorizePost } from "@/components/Categoriser";
import SongsModal from "@/components/SongsModal";
import { Audio } from "expo-av";

const CreatePost = () => {
  const { user, enableAnonymousID } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [enableAIResponse, setEnableAIResponse] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [isSongsModalVisible, setIsSongsModalVisible] = useState(false);
  const [isLoadingSong, setIsLoadingSongSong] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

  const MAX_POST_LENGTH = 1000;
  const CHARACTER_WARNING = 950;

  useEffect(() => {
    setCharacterCount(postContent.length);
    if (
      postContent.length === CHARACTER_WARNING ||
      postContent.length === MAX_POST_LENGTH
    ) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [postContent]);

  const handleCancel = () => {
    if (postContent.length > 0 || selectedSong !== null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const toggleAIResponse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnableAIResponse(!enableAIResponse);
  };


  const handlePostCreation = async () => {
    setIsPosting(true);
    try {
      // 1) classify + safety check
      const { topic, contentType, isSafe } = await categorizePost(postContent);

      // 2) prevent unsafe posts
      if (!isSafe) {
        // optional haptic feedback for warning
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        showToast("This post is toxic!", "error");
        return;
      }

      // 3) proceed with creating the post
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      const newPost = await addPostToDB(
        postContent,
        user.$id,
        formatTopic(topic),
        contentType,
        enableAnonymousID,
        selectedSong?.id
      );
      showToast("Post created successfully!", "success");
      router.back();

      // 4) optional AI follow‑up
      if (newPost?.$id && enableAIResponse) {
        try {
          await addAIResponseToDB(postContent, newPost.$id);
        } catch (err) {
          console.error("Error generating AI response:", err);
        }
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
      showToast(
        error.message?.includes("categorize")
          ? "Unable to classify your post. Please try again."
          : "Failed to create post.",
        "error"
      );
    } finally {
      setIsPosting(false);
    }
  };

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
    setIsLoadingSongSong(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: selectedSong.preview },
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
    } finally {
      setIsLoadingSongSong(false);
    }
  };

  useEffect(() => {
    return () => {
      if (currentSound) currentSound.unloadAsync();
    };
  }, [currentSound]);

  // const handlePostCreation = async () => {
  //   setIsPosting(true);
  //   try {
  //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //     const derivedTopic = await categorizePostTopic(postContent);
  //     const newPost = await addPostToDB(
  //       postContent,
  //       user.$id,
  //       formatTopic(derivedTopic),
  //       enableAnonymousID,
  //       selectedSong?.id
  //     );
  //     showToast("Post created successfully!", "success");
  //     router.back();

  //     if (newPost?.$id && enableAIResponse) {
  //       try {
  //         await addAIResponseToDB(postContent, newPost.$id);
  //       } catch (error) {
  //         console.error("Error generating AI response:", error);
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log("Error creating post:", error);
  //     showToast("Failed to create post", "error");
  //   } finally {
  //     setIsPosting(false);
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={[]}
          keyExtractor={() => "post-create"}
          renderItem={() => null}
          ListHeaderComponent={
            <View className="flex-1" style={{ padding: 16 }}>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="mr-3 p-2 rounded-full bg-gray-100"
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text className="text-xl font-pbold text-gray-800">
                    Create Post
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handlePostCreation}
                  disabled={isPosting || postContent.trim() === ""}
                  className={`py-3 px-8 rounded-full shadow-md transition-all duration-200 ${isPosting || postContent.trim() === ""
                      ? "bg-gray-300"
                      : "bg-secondary hover:bg-secondary-dark"
                    }`}
                  style={{
                    opacity: isPosting || postContent.trim() === "" ? 0.6 : 1,
                  }}
                >
                  <Text
                    className={`text-base font-psemibold ${isPosting || postContent.trim() === ""
                        ? "text-gray-500"
                        : "text-white"
                      }`}
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Post Input */}
              <View className="mb-4">
                <Text className="text-lg font-pbold mb-4">
                  Express Yourself
                </Text>
                <View className="flex-row items-start mb-4">
                  <Avatar username={user.username} imageUrl={user.avatar} />
                  <View className="flex-1 ml-3">
                    <TextInput
                      className="bg-gray-100 p-4 rounded-lg text-base min-h-60 shadow-md font-pregular"
                      placeholder="What's on your mind?"
                      multiline
                      value={postContent}
                      onChangeText={setPostContent}
                      textAlignVertical="top"
                      maxLength={MAX_POST_LENGTH}
                      placeholderTextColor="#999"
                      autoFocus
                    />
                  </View>
                </View>
                <View className="flex-row justify-end">
                  <Text
                    className={`text-xs font-pregular ${characterCount > CHARACTER_WARNING
                        ? "text-red-500"
                        : "text-gray-500"
                      }`}
                  >
                    {characterCount}/{MAX_POST_LENGTH}
                  </Text>
                </View>
              </View>

              {/* Attach Song */}
              {selectedSong ? (
                <View
                  className="flex-row items-center mt-2 mb-3 bg-secondary-100/40 p-3 rounded-lg border border-secondary/10"
                >
                  <View className="w-9 h-9 bg-secondary rounded-full justify-center items-center mr-3 shadow-sm">
                    {isLoadingSong ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <TouchableOpacity
                        onPress={() => (isPlaying ? stopSound() : playSound())}
                      >
                        <Ionicons
                          name={isPlaying ? "pause" : "play"}
                          size={18}
                          color="#ffffff"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-pmedium text-secondary-darkest truncate"
                      numberOfLines={1}
                    >
                      {selectedSong?.title_short}
                    </Text>
                    <Text
                      className="text-xs font-plight text-secondary-dark"
                      numberOfLines={1}
                    >
                      {selectedSong?.artist?.name}
                    </Text>
                  </View>
                  <View className="bg-secondary/10 p-1.5 rounded-full">
                    <TouchableOpacity
                      onPress={() => {
                        isPlaying && stopSound();
                        setSelectedSong(null);
                      }}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsSongsModalVisible(true)}
                  className="flex-row items-center mt-2 mb-3 bg-secondary-100/40 p-3 rounded-lg border border-secondary/10"
                >
                  <View className="w-9 h-9 bg-secondary rounded-full justify-center items-center mr-3 shadow-sm">
                    <FontAwesome name="music" size={18} color="black" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-pmedium text-secondary-darkest truncate"
                      numberOfLines={1}
                    >
                      Select a song
                    </Text>
                    <Text
                      className="text-xs font-plight text-secondary-dark"
                      numberOfLines={1}
                    >
                      Pick a song that resonates with you
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* AI Toggle */}
              {user.role === "student" && (
                <View className="mb-4">
                  <View className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg shadow-md">
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="robot-outline"
                        size={24}
                        color={enableAIResponse ? "#588b76" : "#666"}
                      />
                      <Text
                        className={`ml-2 mr-2 font-pmedium ${enableAIResponse ? "text-[#588b76]" : "text-gray-700"
                          }`}
                      >
                        AuraThreads AI Response
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          showToast("Get an instant AI response", "info")
                        }
                      >
                        <Ionicons
                          name="information-circle-outline"
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    <Switch
                      value={enableAIResponse}
                      onValueChange={toggleAIResponse}
                      trackColor={{ false: "#ccc", true: "#588b76" }}
                      thumbColor={enableAIResponse ? "#fff" : "#f4f3f4"}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                  </View>
                </View>
              )}
            </View>
          }
          keyboardShouldPersistTaps="handled"
        />
      </TouchableWithoutFeedback>
      <SongsModal
        setSelectedSong={setSelectedSong}
        visible={isSongsModalVisible}
        selectedSong={selectedSong}
        onClose={() => setIsSongsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CreatePost;
