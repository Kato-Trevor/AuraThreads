import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import Avatar from "@/components/Avatar";
import { addPostToDB, addAIResponseToDB } from "@/lib/appwrite/appwrite";
import SongsList from "@/components/SongsList";
import { formatTopic } from "@/lib/utils/stringHelpers";
// import { categorizePostTopic } from "@/components/TopicAssigner";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { categorizePost } from "@/components/Categoriser";

const CreatePost = () => {
  const { user, enableAnonymousID } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [enableAIResponse, setEnableAIResponse] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const { topic, contentType } = await categorizePost(postContent);
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

      if (newPost?.$id && enableAIResponse) {
        try {
          await addAIResponseToDB(postContent, newPost.$id);
        } catch (error) {
          console.error("Error generating AI response:", error);
        }
      }
    } catch (error: any) {
      console.log("Error creating post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setIsPosting(false);
    }
  };

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
                  className={`py-3 px-8 rounded-full shadow-md transition-all duration-200 ${
                    isPosting || postContent.trim() === ""
                      ? "bg-gray-300"
                      : "bg-secondary hover:bg-secondary-dark"
                  }`}
                  style={{
                    opacity: isPosting || postContent.trim() === "" ? 0.6 : 1,
                  }}
                >
                  <Text
                    className={`text-base font-psemibold ${
                      isPosting || postContent.trim() === ""
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
                  <Avatar username={user.username} />
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
                    className={`text-xs font-pregular ${
                      characterCount > CHARACTER_WARNING
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {characterCount}/{MAX_POST_LENGTH}
                  </Text>
                </View>
              </View>

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
                        className={`ml-2 mr-2 font-pmedium ${
                          enableAIResponse ? "text-[#588b76]" : "text-gray-700"
                        }`}
                      >
                        AuraThreads AI Response
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          showToast(
                            "AI will generate a thoughtful response to your post",
                            "info"
                          )
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

              {/* Attach Music */}
              <View className="mb-4">
                <Text className="text-lg font-pbold mb-2">
                  Attach Music (Optional)
                </Text>
                <Text className="text-gray-500 mb-4 font-pregular">
                  Add a song that matches your mood
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <SongsList
              selectedSong={selectedSong}
              onSongSelect={setSelectedSong}
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreatePost;
