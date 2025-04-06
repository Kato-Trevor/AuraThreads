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
import { categorizePostTopic } from "@/components/TopicAssigner";
import Colors from "@/assets/colors/colors";


const CreatePost = () => {
  const { user, enableAnonymousID } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [enableAIResponse, setEnableAIResponse] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handlePostCreation = async () => {
    try {
      const derivedTopic = await categorizePostTopic(postContent)
  
      const newPost = await addPostToDB(
        postContent,
        user.$id,
        formatTopic(derivedTopic), 
        enableAnonymousID,
        selectedSong?.id
      );
      showToast("Post created successfully!", "success");
      router.back();
  
      if (newPost?.$id) {
       
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
            <Text style={{ color: Colors.darkestGreen }} className="text-lg">Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)}>
            <Text className="text-secondary text-lg">Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < 3 ? (
          <TouchableOpacity
            onPress={() => setCurrentStep(currentStep + 1)}
            className={`py-2 px-4 rounded ${
              (currentStep === 1 && postContent === "")
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

      {/*Content based on current step*/}
      {currentStep === 1 && (
        <View className="flex-row items-start mb-4">
          {/* <Avatar username={user.username} /> */}
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
        <SongsList selectedSong={selectedSong} onSongSelect={setSelectedSong} />
      )}
    </SafeAreaView>
  );
};

export default CreatePost;
