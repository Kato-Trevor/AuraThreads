// import { Link } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { View, Text } from "react-native";
// import Avatar from "./Avatar";
// import { formatDistanceToNow } from "date-fns";
// import { Ionicons } from "@expo/vector-icons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import getSongById from "@/services/get-song";

// const Post = ({ post }: { post: PostModel }) => {
//   const timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
//     addSuffix: true,
//   });

//   const [song, setSong] = useState<any>();

//   useEffect(() => {
//     const fetchSong = async () => {
//       if (post.songId) {
//         const song = await getSongById(post.songId);
//         setSong(song);
//       }
//     };
//     fetchSong();
//   }, [post.songId]);

//   return (
//     <Link
//       href={{
//         pathname: "/threads/[id]",
//         params: { id: `${post.$id}` },
//       }}
//     >
//       <View className="p-4 rounded-lg flex-row items-start">
//         <Avatar username={post.userId.username} />
//         <View className="flex-1 px-1 ml-2">
//           {post.songId && (
//             <View className="flex-row justify-start items-center mb-1">
//               <FontAwesome name="music" size={15} color="black" />
//               <Text className="text-xs text-gray-500 ml-1">{song?.artist?.name} • {song?.title_short}</Text>
//             </View>
//           )}
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">@{post.userId.username}</Text>
//             <Text className="text-xs text-gray-500 text-right">{timeAgo}</Text>
//           </View>
//           <Text className="text-lg text-gray-800">{post.content}</Text>
//           <Text className="text-xs text-secondary">#{post.topic}</Text>
//           {post?.responses?.length ? (
//             <View className="flex-row justify-start mt-2 space-x-4">
//               <View className="p-1 flex-row items-center gap-2">
//                 <Ionicons name="chatbubble-outline" size={15} color="gray" />
//                 <Text className="text-xs text-gray-500">
//                   {post.responses.length}
//                 </Text>
//               </View>
//             </View>
//           ) : null}
//         </View>
//       </View>
//       <View className="h-[0.5px] bg-gray-200 w-full" />
//     </Link>
//   );
// };

import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import getSongById from "@/services/get-song";

const Post = ({ post }: { post: PostModel }) => {
  let timeAgo = formatDistanceToNow(new Date(`${post.$createdAt}`), {
    addSuffix: true,
  }).replace(/^about\s/, "");

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
      {/* <View className="pt-3.5 pb-3.5 pr-3 pl-3 rounded-lg flex-row items-start bg-white border-b border-gray-100"> */}
      <View className="pt-3.5 pb-3.5 pr-3 pl-3 rounded-lg flex-row items-start bg-white ">
        <Avatar username={post.userId.username} />
        <View className="flex-1 px-1 ml-2 justify-between">
          {/* Top row with response count and username/time */}
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-xs text-gray-500">
              {post.responses?.length ?? 0}{" "}
              {(post.responses?.length ?? 0) === 1 ? "response" : "responses"}
            </Text>
            <Text className="text-xs text-right">
              <Text style={{ color: '#588b76' }}>@{post.userId.username}</Text>{" "}
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

            {/* Bookmark icon */}
            {/* <Ionicons
              name="bookmark-outline"
              size={16}
              color="gray"
              style={{ marginLeft: 8 }}
            /> */}
          </View>
        </View>
      </View>
    </Link>
  );
};

export default Post;