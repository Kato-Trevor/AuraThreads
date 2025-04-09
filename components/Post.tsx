import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import getSongById from "@/services/get-song";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";

const Post = ({ post }: { post: PostModel }) => {
  const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  });

  const [song, setSong] = useState<any>();
  const [username, setUsername] = useState("");
  const MAX_CONTENT_LENGTH = 300;

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

  const isContentTruncated = post.content.length > MAX_CONTENT_LENGTH;
  const displayContent = isContentTruncated
    ? `${post.content.substring(0, MAX_CONTENT_LENGTH)}...`
    : post.content;

  return (
    <Link
      href={{
        pathname: "/threads/[id]",
        params: { id: `${post.$id}` },
      }}
    >
      <View className="w-full bg-white border-b border-gray-100 px-4 py-3">
        {/* Header section */}
        <View className="flex-row items-center mb-2">
          <Avatar username={username} />
          <View className="ml-2.5 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-800 text-sm">
                {post.userId.role === "counselor" ? username : `@${username}`}
              </Text>
              <Text className="text-xs text-gray-400">{timeAgo}</Text>
            </View>
          </View>
        </View>

        {/* Content section */}
        <View className="pl-10 pr-2">
          <Text className="text-gray-800 leading-5">{displayContent}</Text>
          {isContentTruncated && (
            <Text className="text-secondary text-xs mt-1">Tap to see more</Text>
          )}
        </View>

        {/* Bottom row with topic and song */}
        <View className="flex-row items-center justify-between mt-2 pl-10">
          {post.topic && (
            <View className="mt-2 mb-1">
              <View className="bg-gray-100 self-start rounded-full px-2.5">
                <Text className="text-xs text-secondary font-medium">
                  #{post.topic}
                </Text>
              </View>
            </View>
          )}

          {post.songId && song && (
            <View className="flex-row items-center bg-gray-50 rounded-md px-2 py-1">
              <FontAwesome
                name="music"
                size={10}
                color="#1e4635"
                className="mr-1"
              />
              <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                {song?.title_short} • {song?.artist?.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Link>
  );
};

export default Post;
