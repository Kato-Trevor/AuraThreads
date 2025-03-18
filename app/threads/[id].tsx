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
import React, { useEffect, useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const fetchedPost = await getPostFromDB(`${postId}`);
        setPost(fetchedPost);
        await fetchResponsesToPost();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchResponsesToPost = async () => {
    try {
      const fetchedResponses = await getResponsesToPost(`${postId}`);
      setFetchedResponses(fetchedResponses);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const createResponse = async () => {
    if (!response.trim()) return;

    try {
      await addResponseToDB(response, `${postId}`);
      showToast("Response created successfully!", "success");
      setResponse("");
      await fetchResponsesToPost();
      // Scroll to the bottom to see the new response
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error creating response:", error);
      showToast("Error creating response!", "error");
    }
  };

  if (isLoading) {
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
      <SafeAreaView className="flex-1">
        {/* Post at the top */}
        <View className="flex-1">
          {post && (
            <View className="p-4 bg-gray-50">
              <Text className="text-base font-bold mb-2 text-gray-600">
                Original Post
              </Text>
              <Text className="text-lg text-gray-800 mb-3">{post.content}</Text>
              <View className="h-px bg-gray-200 mt-2" />
            </View>
          )}

          {/* Responses in the middle */}
          <Text className="text-base font-bold mt-3 ml-4 text-gray-600">
            Responses
          </Text>
          {fetchedResponses.length === 0 ? (
            <Text className="p-4 italic text-gray-500 text-center">
              No responses yet. Be the first to respond!
            </Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={fetchedResponses}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <View className="p-3 bg-gray-100 rounded-lg mt-3 mx-4">
                  <Text className="text-base text-gray-800">
                    {item.content}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(item.$createdAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
