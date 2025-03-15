import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { getPostFromDB } from "@/lib/appwrite/appwrite";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Thread() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostFromDB(id as string);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <View>
      {post ? (
        <Text className="text-lg text-gray-800">{post.content}</Text>
      ) : (
        <LoadingSpinner visible={true} />
      )}
    </View>
  );
}
