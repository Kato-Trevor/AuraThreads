import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Animated,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import Avatar from "@/components/Avatar";
import { addPostToDB } from "@/lib/appwrite/appwrite";
import { topics } from "@/constants/constants";
import TopicsList from "@/components/TopicsList";
import SongsList from "@/components/SongsList";
import { formatTopic } from "@/utils/stringHelpers";
import { addAIResponseToDB } from "@/lib/appwrite/appwrite";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const CreatePost = () => {
  const { user } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [enableAIResponse, setEnableAIResponse] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const MAX_POST_LENGTH = 500;
  const CHARACTER_WARNING = 450;

  // Ref for the main content container
  const contentRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  useEffect(() => {
    setCharacterCount(postContent.length);

    // Give haptic feedback when approaching limit
    if (
      postContent.length === CHARACTER_WARNING ||
      postContent.length === MAX_POST_LENGTH
    ) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [postContent]);

  const handleCancel = () => {
    if (
      postContent.length > 0 ||
      selectedTopic !== "" ||
      selectedSong !== null
    ) {
      // Could add a confirmation dialog here
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const goToNextStep = () => {
    if (
      (currentStep === 1 && postContent !== "") ||
      (currentStep === 2 && selectedTopic !== "")
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(currentStep - 1);
  };

  const toggleAIResponse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnableAIResponse(!enableAIResponse);
  };

  const handlePostCreation = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newPost = await addPostToDB(
        postContent,
        user.$id,
        formatTopic(selectedTopic),
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
    } catch (error) {
      console.log("Error creating post:", error);
      showToast("Failed to create post", "error");
    }
  };

  const renderProgressIndicator = () => (
    <View className="mb-4 px-2">
      <View className="h-2 bg-gray-200 rounded-full w-full">
        <Animated.View
          className="h-2 bg-pink-500 rounded-full"
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>
      <View className="flex-row justify-between mt-1">
        <Text
          className={`text-xs ${
            currentStep >= 1 ? "text-pink-500 font-pbold" : "text-gray-500"
          }`}
        >
          Content
        </Text>
        <Text
          className={`text-xs ${
            currentStep >= 2 ? "text-pink-500 font-pbold" : "text-gray-500"
          }`}
        >
          Topic
        </Text>
        <Text
          className={`text-xs ${
            currentStep >= 3 ? "text-pink-500 font-pbold" : "text-gray-500"
          }`}
        >
          Music
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="mb-4 flex-1">
            <Text className="text-lg font-bold mb-4">Express Yourself</Text>

            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
              <View className="flex-row items-start mb-4">
                <Avatar username={user.username} />
                <View className="flex-1 ml-3">
                  <TextInput
                    className="bg-gray-100 p-4 rounded-lg text-base min-h-40 shadow-sm"
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
            </TouchableOpacity>

            <View className="flex-row justify-between items-center">
              <Text
                className={`text-xs ${
                  characterCount > CHARACTER_WARNING
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {characterCount}/{MAX_POST_LENGTH}
              </Text>
              <View className="flex-row">
                {/* Add image button */}
                <TouchableOpacity
                  className="p-2 mr-2 rounded-full bg-gray-100"
                  onPress={() => showToast("Image upload coming soon!", "info")}
                >
                  <Ionicons name="image-outline" size={22} color="#666" />
                </TouchableOpacity>
                {/* Add emoji button */}
                <TouchableOpacity
                  className="p-2 rounded-full bg-gray-100"
                  onPress={() => showToast("Emoji picker coming soon!", "info")}
                >
                  <MaterialCommunityIcons
                    name="emoticon-outline"
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View className="flex-1">
            <Text className="text-lg font-bold mb-3">Select a Topic</Text>
            <Text className="text-gray-500 mb-4">
              Choose a topic to help others find your post
            </Text>

            <TopicsList
              topics={topics}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
          </View>
        );
      case 3:
        return (
          <View className="flex-1">
            <Text className="text-lg font-bold mb-2">Add Music (Optional)</Text>
            <Text className="text-gray-500 mb-4">
              Add a song that matches your mood
            </Text>
            {/* SongsList component without a ScrollView wrapper */}
            <SongsList
              selectedSong={selectedSong}
              onSongSelect={setSelectedSong}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        {/* Header with title and steps */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Left Section: Close Button and Title */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleCancel}
              className="mr-3 p-2 rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Create Post</Text>
          </View>

          {/* Right Section: Step Indicator and Action Button */}
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-3">
              Step {currentStep} of 3
            </Text>
            {currentStep < 3 ? (
              <TouchableOpacity
                onPress={goToNextStep}
                disabled={
                  (currentStep === 1 && postContent.trim() === "") ||
                  (currentStep === 2 && !selectedTopic)
                }
                className={`py-3 px-8 rounded-full shadow-md transition-all duration-200 ${
                  (currentStep === 1 && postContent.trim() === "") ||
                  (currentStep === 2 && !selectedTopic)
                    ? "bg-gray-300"
                    : "bg-pink-500 hover:bg-secondary-dark"
                }`}
                style={{
                  opacity:
                    (currentStep === 1 && postContent.trim() === "") ||
                    (currentStep === 2 && !selectedTopic)
                      ? 0.6
                      : 1,
                }}
              >
                <Text
                  className={`text-base font-semibold ${
                    (currentStep === 1 && postContent.trim() === "") ||
                    (currentStep === 2 && !selectedTopic)
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                >
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handlePostCreation}
                className="py-2 px-6 rounded-full bg-secondary shadow-md"
              >
                <Text className="text-sm font-medium text-white">Post</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {renderProgressIndicator()}

        <View className="flex-1" ref={contentRef}>
          {renderContent()}
        </View>

        <View
          className={`border-t border-gray-100 pt-3 ${
            isKeyboardVisible ? "opacity-0" : "opacity-100"
          }`}
        >
          {currentStep === 1 && (
            <View className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={24}
                  color={enableAIResponse ? "#F032DA" : "#666"}
                />
                <Text
                  className={`ml-2 mr-2 font-medium ${
                    enableAIResponse ? "text-[#F032DA]" : "text-gray-700"
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
                trackColor={{ false: "#ccc", true: "#F032DA" }}
                thumbColor={enableAIResponse ? "#fff" : "#f4f3f4"}
                style={{
                  transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                }}
              />
            </View>
          )}

          {currentStep > 1 && (
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={goToPreviousStep}
                className="flex-row items-center"
              >
                <Ionicons name="arrow-back" size={22} color="#666" />
                <Text className="text-gray-700 ml-1">Back</Text>
              </TouchableOpacity>

              <View className="flex-row">
                {currentStep === 2 && (
                  <Text className="text-gray]-500">
                    {selectedTopic
                      ? `Selected: ${selectedTopic}`
                      : "No topic selected"}
                  </Text>
                )}
                {currentStep === 3 && (
                  <Text className="text-gray-500">
                    {selectedSong
                      ? `Song: ${selectedSong.title}`
                      : "No song selected"}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePost;
