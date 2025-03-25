import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { getResponsesToPost } from "@/lib/appwrite/appwrite";

const Post = ({ post }: { post: PostModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  });

  const [responses, setResponses] = useState<any>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const responses = await getResponsesToPost(`${post.$id}`);
      setResponses(responses);
    };
    fetchResponses();
  }, []);

  return (
    <Link
      href={{
        pathname: "/threads/[id]",
        params: { id: `${post.$id}` },
      }}
    >
      <View className="p-4 bg-gray-100 rounded-lg flex-row items-start">
        <Avatar username={post.userId.username} />
        <View className="flex-1 px-1 ml-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">{post.userId.username}</Text>
            <Text className="text-xs text-gray-500 text-right">{timeAgo}</Text>
          </View>
          <Text className="text-lg text-gray-800 mt-1">{post.content}</Text>
          <Text className="text-xs text-secondary">#{post.topic}</Text>
          {responses.length ? (
            <View className="flex-row justify-start mt-2 space-x-4">
              <View className="p-1 flex-row items-center gap-2">
                <Ionicons name="chatbubble-outline" size={15} color="gray" />
                <Text className="text-xs text-gray-500">
                  {responses.length}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
      <View className="h-[0.5px] bg-gray-200 w-full" />
    </Link>
  );
};

export default Post;
