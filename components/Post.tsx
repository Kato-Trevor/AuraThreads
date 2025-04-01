import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import getSongById from "@/services/get-song";

const Post = ({ post }: { post: PostModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  });

  const [song, setSong] = useState<any>();

  useEffect(() => {
    const fetchSong = async () => {
      if (post.songId) {
        const song = await getSongById(post.songId);
        setSong(song);
      }
    };
    fetchSong();
  }, [post.songId]);

  return (
    <Link
      href={{
        pathname: "/threads/[id]",
        params: { id: `${post.$id}` },
      }}
    >
      <View className="p-4 rounded-lg flex-row items-start">
        <Avatar username={post.userId.username} />
        <View className="flex-1 px-1 ml-2">
          {post.songId && (
            <View className="flex-row justify-start items-center mb-1">
              <FontAwesome name="music" size={15} color="black" />
              <Text className="text-xs text-gray-500 ml-1">{song?.artist?.name} • {song?.title_short}</Text>
            </View>
          )}
          <View className="flex-row justify-between">
            <Text className="text-gray-500">@{post.userId.username}</Text>
            <Text className="text-xs text-gray-500 text-right">{timeAgo}</Text>
          </View>
          <Text className="text-lg text-gray-800">{post.content}</Text>
          <Text className="text-xs text-secondary">#{post.topic}</Text>
          {post?.responses?.length ? (
            <View className="flex-row justify-start mt-2 space-x-4">
              <View className="p-1 flex-row items-center gap-2">
                <Ionicons name="chatbubble-outline" size={15} color="gray" />
                <Text className="text-xs text-gray-500">
                  {post.responses.length}
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
