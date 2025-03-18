import { Link } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post }: { post: PostModel | ResponseModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), { addSuffix: true });

  return (
    <Link
      className="p-4 mb-4 bg-gray-100 rounded-lg flex-row items-start"
      href={{
        pathname: "/threads/[id]",
        params: { id: `${post.$id}` },
      }}
    >
      <Avatar username={post.userId.username} />
      <View className="flex-1 px-2">
        <View className="flex-row justify-between">
          <Text className="text-gray-500">{post.userId.username}</Text>
          <Text className="text-xs text-gray-500 text-right">
            {timeAgo}
          </Text>
        </View>
        <Text className="text-lg text-gray-800 mt-1">{post.content}</Text>
      </View>
    </Link>
  );
};

export default Post;
