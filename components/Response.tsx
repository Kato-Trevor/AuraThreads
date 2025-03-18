import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import {
  addDislikeToResponse,
  addLikeToResponse,
  removeDislikeFromResponse,
  removeLikeFromResponse,
} from "@/lib/appwrite/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Response = ({ response }: { response: ResponseModel }) => {
  const { user } = useGlobalContext();
  const timeAgo = formatDistanceToNow(new Date(`${response.$createdAt}`), {
    addSuffix: true,
  });

  const isLiked = () => {
    if (response.likedBy.some((userFromDB: any) => userFromDB.$id === user.$id)) {
      return true;
    }
    return false;
  };

  const isDisLiked = () => {
    if (response.dislikedBy.some((userFromDB: any) => userFromDB.$id === user.$id)) {
      return true;
    }
    return false;
  };

  const [liked, setLiked] = useState(isLiked);
  const [disliked, setDisliked] = useState(isDisLiked);

  const handleLike = async () => {
    try {
      setLiked(true);
      if (disliked) {
        setDisliked(false);
        await removeDislikeFromResponse(response.$id!, user.$id);
      }
      await addLikeToResponse(response.$id!, user.$id);
    } catch (error) {
      console.error("Error liking response:", error);
      setLiked(false);
    }
  };

  const handleDislike = async () => {
    try {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        await removeLikeFromResponse(response.$id!, user.$id);
      }
      await addDislikeToResponse(response.$id!, user.$id);
    } catch (error) {
      console.error("Error disliking response:", error);
      setDisliked(false);
    }
  };

  return (
    <View className="p-4 mb-4 bg-gray-100 rounded-lg flex-row items-start">
      <Avatar username={response.userId.username} />
      <View className="flex-1 px-2">
        <View className="flex-row justify-between">
          <Text className="text-gray-500">{response.userId.username}</Text>
          <Text className="text-xs text-gray-500 text-right">{timeAgo}</Text>
        </View>
        <Text className="text-lg text-gray-800 mt-1">{response.content}</Text>
        <View className="flex-row justify-start mt-2 space-x-4">
          <TouchableOpacity className="mr-4" onPress={handleLike}>
            <View className="p-1">
              <Ionicons
                name={liked ? "thumbs-up" : "thumbs-up-outline"}
                size={15}
                color={liked ? "#F032DA" : "gray"}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDislike}>
            <View className="p-1">
              <Ionicons
                name={disliked ? "thumbs-down" : "thumbs-down-outline"}
                size={15}
                color={disliked ? "#F032DA" : "gray"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Response;
