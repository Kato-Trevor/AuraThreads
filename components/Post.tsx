import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Feather, FontAwesome } from "@expo/vector-icons";
import getSongById from "@/services/get-song";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";

const Post = ({ post }: { post: PostModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  });

  const [song, setSong] = useState<any>();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (post.userId.role === "student") {
      if (post.isAnonymous) {
        setUsername(generateAnonymousUsername());
      } else {
        setUsername(post.userId.username!);
      }
    } else {
      setUsername(`${post.userId.surname} ${post.userId.givenNames}`);
    }
  }, [post]);

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
      <View className="w-full bg-white border-b border-gray-100 px-3 py-2">
        {/* Header section - More compact */}
        <View className="flex-row items-center mb-1.5">
          <Avatar username={username} />
          <View className="ml-2 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-gray-800 text-sm">
                {post.userId.role === "counselor" ? username : `@${username}`}
              </Text>
              <Text className="text-xs text-gray-400">{timeAgo}</Text>
            </View>
          </View>
        </View>

        {/* Content section - Simplified */}
        <Text className="text-gray-800 text-sm pl-9">{post.content}</Text>

        {/* Topic tag - Moved to right below content and made smaller */}
        {post.topic && (
          <Text className="text-xs text-pink-500 pl-9 pt-1">#{post.topic}</Text>
        )}

        {/* Song section - Much more compact design */}
        {post.songId && song && (
          <View className="flex-row items-center pl-8 mt-1.5">
            <FontAwesome name="music" size={12} color="#db2777" />
            <Text className="text-xs text-gray-600 ml-1.5 flex-1">
              {song?.title_short} • {song?.artist?.name}
            </Text>
            <TouchableOpacity className="py-1 px-1.5">
              <Feather name="play" size={12} color="#db2777" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Link>
  );
};

export default Post;
