import { Text, View, TouchableOpacity, TextInput, Switch } from "react-native";
import React, { useState } from "react";
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
import { categorizePostTopic } from "@/components/TopicAssigner";


const CreatePost = () => {
  const { user } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [enableAIResponse, setEnableAIResponse] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  // const handlePostCreation = async () => {
  //   try {
  //     const newPost = await addPostToDB(
  //       postContent,
  //       user.$id,
  //       formatTopic(selectedTopic),
  //       selectedSong?.id
  //     );
  //     showToast("Post created successfully!", "success");
  //     router.back();

  //     if (newPost?.$id && enableAIResponse) {
  //       try {
  //         await addAIResponseToDB(postContent, newPost.$id);
  //       } catch (error: any) {
  //         console.error("Error generating AI response:", error);
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log("Error creating post:", error);
  //     showToast("Failed to create post", "error");
  //   }
  // };




  const handlePostCreation = async () => {
    try {
      // Derive the topic from the post content rather than using the selectedTopic
      const derivedTopic = await categorizePostTopic(postContent)
  
      const newPost = await addPostToDB(
        postContent,
        user.$id,
        formatTopic(derivedTopic), // Use the derived topic here
        selectedSong?.id
      );
      showToast("Post created successfully!", "success");
      router.back();
  
      if (newPost?.$id && enableAIResponse) {
        try {
          await addAIResponseToDB(postContent, newPost.$id);
        } catch (error: any) {
          console.error("Error generating AI response:", error);
        }
      }
    } catch (error: any) {
      console.log("Error creating post:", error);
      showToast("Failed to create post", "error");
    }
  };



  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/*Action buttons*/}
      <View className="flex-row justify-between items-center mb-2">
        {currentStep === 1 ? (
          <TouchableOpacity onPress={handleCancel}>
            <Text className="text-secondary text-lg">Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)}>
            <Text className="text-secondary text-lg">Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < 3 ? (
          <TouchableOpacity
            onPress={() => setCurrentStep(currentStep + 1)}
            // disabled={
            //   (currentStep === 1 && postContent === "") ||
            //   (currentStep === 2 && !selectedTopic)
            // }
            className={`py-2 px-4 rounded ${
              (currentStep === 1 && postContent === "") ||
              (currentStep === 2 && !selectedTopic)
                ? "bg-gray-300"
                : "bg-secondary"
            }`}
          >
            <Text
              className={`text-lg ${
                (currentStep === 1 && postContent === "") ||
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
            className="py-2 px-4 rounded bg-secondary"
          >
            <Text className="text-lg text-white">Post</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center mb-4">
        <Text className="text-lg text-gray-700 mr-2">Response from AuraThreads AI</Text>
        <Switch
          value={enableAIResponse}
          onValueChange={setEnableAIResponse}
          trackColor={{ false: "#ccc", true: "#F032DA" }}
          thumbColor={enableAIResponse ? "#F032DA" : "#f4f3f4"}
        />
      </View>

      {/*Content based on current step*/}
      {currentStep === 1 && (
        <View className="flex-row items-start mb-4">
          <Avatar username={user.username} />
          <TextInput
            className="flex-1 px-4 rounded-lg text-lg"
            placeholder="How are you feeling?"
            multiline
            value={postContent}
            onChangeText={setPostContent}
            textAlignVertical="top"
          />
        </View>
      )}

      {currentStep === 2 && (
        <TopicsList
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />
      )}

      {currentStep === 3 && (
        <SongsList selectedSong={selectedSong} onSongSelect={setSelectedSong} />
      )}
    </SafeAreaView>
  );
};

export default CreatePost;
