import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Feather } from "@expo/vector-icons";
import getSongById from "@/services/get-song";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";

const Post = ({ post }: { post: PostModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  });

  const [song, setSong] = useState<any>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20));
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

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Link
      href={{
        pathname: "/threads/[id]",
        params: { id: `${post.$id}` },
      }}
    >
      <View className="w-full bg-white border-b border-gray-200 px-4 py-3">
        {/* Header section */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Avatar username={username} />
            <View className="ml-2">
              <Text className="font-bold text-gray-800">
                {post.userId.role === "counselor" ? username : `@${username}`}
              </Text>
              <Text className="text-xs text-gray-500">{timeAgo}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Content section */}
        <View className="mb-2">
          <Text className="text-base text-gray-800 mb-2">{post.content}</Text>

          {/* Topic tag */}
          <View className="flex-row flex-wrap mt-1">
            <TouchableOpacity className="bg-pink-100 px-3 py-1 rounded-full mr-2 mb-1">
              <Text className="text-sm text-pink-500 font-medium">
                #{post.topic}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Song section (if applicable) */}
        {post.songId && song && (
          <TouchableOpacity className="flex-row items-center p-2 bg-gray-50 rounded-lg mb-2">
            <View className="w-10 h-10 bg-pink-200 rounded-md mr-3 items-center justify-center">
              <FontAwesome name="music" size={16} color="#db2777" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">
                {song?.title_short}
              </Text>
              <Text className="text-xs text-gray-500">
                {song?.artist?.name}
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Feather name="play-circle" size={22} color="#db2777" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Mock image (if applicable) - uncomment if needed */}
        {/* {Math.random() > 0.5 && (
          <View className="h-48 bg-pink-100 rounded-lg mb-2 overflow-hidden w-full">
            <View className="h-full w-full bg-pink-200 opacity-80" />
          </View>
        )} */}

        {/* Interaction section */}
        <View className="flex-row justify-between pt-2">
          <TouchableOpacity
            className="flex-row items-center p-2"
            onPress={handleLike}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "#db2777" : "gray"}
            />
            <Text className="text-sm text-gray-600 ml-1">{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="chatbubble-outline" size={20} color="gray" />
            <Text className="text-sm text-gray-600 ml-1">
              {post.responses?.length || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-2">
            <Feather name="share" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-2">
            <Feather name="bookmark" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </Link>
  );
};

export default Post;
