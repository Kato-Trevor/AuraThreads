import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import getSongById from "@/services/get-song";
import Colors from "@/assets/colors/colors";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";

const Post = ({ post }: { post: PostModel }) => {
  let timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  }).replace(/^about\s/, "");

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
      {/* <View className="pt-3.5 pb-3.5 pr-3 pl-3 rounded-lg flex-row items-start bg-white border-b border-gray-100"> */}
      <View className="pt-3.5 pb-3.5 pr-3 pl-3 rounded-lg flex-row items-start bg-white ">
        <Avatar username={username} />
        <View className="flex-1 px-1 ml-2 justify-between">
          {/* Top row with response count and username/time */}
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-xs text-gray-500">
              {post.responses?.length ?? 0}{" "}
              {(post.responses?.length ?? 0) === 1 ? "response" : "responses"}
            </Text>
            <Text className="text-xs text-right">
              <Text style={{ color: Colors.Green }}>{post.userId.role === "counselor" ? username : `@${username}`}</Text>{" "}
              <Text className="text-gray-400">posted {timeAgo}</Text>
            </Text>
          </View>

          {/* Post content */}
          <Text className="text-base text-gray-800">{post.content}</Text>

          {/* Song info and bookmark */}
          <View className="flex-row justify-between items-end mt-2">
            {post.songId ? (
              <View className="flex-row items-center flex-1 pr-2">
                <FontAwesome name="music" size={15} color="black" />
                <Text
                  className="text-xs text-gray-500 ml-1 flex-1"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {song?.artist?.name} • {song?.title_short}
                </Text>
              </View>
            ) : (
              <View className="flex-1" />
            )}
          </View>
        </View>
      </View>
    </Link>
  );
};

export default Post;