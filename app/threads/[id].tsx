import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  addResponseToDB,
  getPostFromDB,
  getResponsesToPost,
} from "@/lib/appwrite/appwrite";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@/components/ToastProvider";

export default function Thread() {
  const { id: postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [response, setResponse] = useState<string>("");
  const [fetchedResponses, setFetchedResponses] = useState<any>([]);
  const { showToast } = useToast();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostFromDB(`${postId}`);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchResponsesToPost = async () => {
    try {
      const fetchedResponses = await getResponsesToPost(`${postId}`);
      setFetchedResponses(fetchedResponses);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchResponsesToPost();
  }, [postId]);

  const createResponse = async () => {
    try {
      await addResponseToDB(response, `${postId}`);
      showToast("Response created successfully!", "success");
      setResponse("");
      fetchResponsesToPost();
    } catch (error) {
      console.error("Error creating response:", error);
      showToast("Error creating response!", "error");
    }
  };

  return (
    <SafeAreaView>
      {post ? (
        <Text className="text-lg text-gray-800">{post.content}</Text>
      ) : (
        <LoadingSpinner visible={true} />
      )}
      <FlatList
        data={fetchedResponses}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text className="text-lg text-gray-800">{item.content}</Text>
        )}
      />
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white flex-row items-center">
        <TextInput
          className="flex-1 p-4 bg-gray-200 rounded-lg text-lg"
          placeholder="Post a response"
          value={response}
          onChangeText={setResponse}
        />
        <TouchableOpacity onPress={createResponse} className="ml-2">
          <Ionicons name="send" size={24} color="#F032DA" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
