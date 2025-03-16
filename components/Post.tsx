import { Link } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";

const Post = ({ post }: { post: PostModel }) => {
  return (
    <Link
        className="p-4 mb-4 bg-gray-100 rounded-lg flex-row posts-start"
        href={{
          pathname: "/threads/[id]",
          params: { id: `${post.$id}` },
        }}
      >
        <Avatar username={post.userId.username} className="mr-4"/>
        <View className="ml-4 flex-1">
          <Text className="text-gray-500">{post.userId.username}</Text>
          <Text className="text-lg text-gray-800">{post.content}</Text>
        </View>
      </Link>
  );
};

export default Post;