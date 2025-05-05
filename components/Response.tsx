import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import {
  addReaction,
  removeReaction,
  getReaction,
  getLikeCount,
  getDislikeCount,
  updateReaction,
} from "@/lib/appwrite/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { generateAnonymousUsername } from "@/lib/utils/generateAnonymousId";
import { Link } from "expo-router";

const Response = ({ response }: { response: ResponseModel }) => {
  const { user } = useGlobalContext();
  const timeAgo = formatDistanceToNow(new Date(`${response.$createdAt}`), {
    addSuffix: true,
  });

  const [reaction, setReaction] = useState<any>();
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (response.userId.role !== "counselor") {
      if (response.isAnonymous) {
        setUsername(generateAnonymousUsername());
      } else {
        setUsername(response.userId.username!);
      }
    } else {
      setUsername(`${response.userId.surname} ${response.userId.givenNames}`);
    }
  }, [response]);

  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const fetchedReaction = await getReaction(user.$id, response.$id!);
        setReaction(fetchedReaction);
      } catch (error) {
        console.error("Error fetching reaction:", error);
      }
    };

    fetchReaction();
  }, [user.$id, response.$id]);

  useEffect(() => {
    if (reaction) {
      setLiked(reaction.reactionType === "like");
      setDisliked(reaction.reactionType === "dislike");
    }
  }, [reaction]);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const fetchedLikeCount = await getLikeCount(response.$id!);
        setLikeCount(fetchedLikeCount);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchLikeCount();
  }, [response.$id]);

  useEffect(() => {
    const fetchDislikeCount = async () => {
      try {
        const fetchedDislikeCount = await getDislikeCount(response.$id!);
        setDislikeCount(fetchedDislikeCount);
      } catch (error) {
        console.error("Error fetching dislike count:", error);
      }
    };

    fetchDislikeCount();
  }, [response.$id]);

  const handleLike = async () => {
    const initialLiked = liked;
    const initialDisliked = disliked;
    const initialLikeCount = likeCount;
    const initialDislikeCount = dislikeCount;

    try {
      if (liked) {
        setLiked(false);
        setLikeCount(likeCount - 1);
        await removeReaction(reaction.$id);
        setReaction(null);
      } else {
        setLiked(true);
        setLikeCount(likeCount + 1);
        if (disliked) {
          setDisliked(false);
          setDislikeCount(dislikeCount - 1);
        }
        if (!reaction) {
          const createdReaction = await addReaction(
            response.$id!,
            user.$id,
            "like"
          );
          setReaction(createdReaction);
        } else {
          const updatedReaction = await updateReaction(reaction.$id, "like");
          setReaction(updatedReaction);
        }
      }
    } catch (error) {
      console.error("Error handling like", error);

      setLiked(initialLiked);
      setDisliked(initialDisliked);
      setLikeCount(initialLikeCount);
      setDislikeCount(initialDislikeCount);
    }
  };

  const handleDislike = async () => {
    const initialLiked = liked;
    const initialDisliked = disliked;
    const initialLikeCount = likeCount;
    const initialDislikeCount = dislikeCount;

    try {
      if (disliked) {
        setDisliked(false);
        setDislikeCount(dislikeCount - 1);
        await removeReaction(reaction.$id);
        setReaction(null);
      } else {
        setDisliked(true);
        setDislikeCount(dislikeCount + 1);
        if (liked) {
          setLiked(false);
          setLikeCount(likeCount - 1);
        }
        if (!reaction) {
          const createdReaction = await addReaction(
            response.$id!,
            user.$id,
            "dislike"
          );
          setReaction(createdReaction);
        } else {
          const updatedReaction = await updateReaction(reaction.$id, "dislike");
          setReaction(updatedReaction);
        }
      }
    } catch (error) {
      console.error("Error handling like", error);

      // Revert all states back to their initial values
      setLiked(initialLiked);
      setDisliked(initialDisliked);
      setLikeCount(initialLikeCount);
      setDislikeCount(initialDislikeCount);
    }
  };

  return (
    <>
      <View className="p-4 rounded-lg flex-row items-start">
        <Avatar username={username} imageUrl={response.userId.avatar} />
        <View className="flex-1 px-2">
          <View className="flex-row justify-between">
            {response.userId.role === "counselor" ? (
              <Link
                href={{
                  pathname: "/profile/[id]",
                  params: { id: `${response.userId.$id}` },
                }}
              >
                <Text className="font-pregular text-gray-500">{username}</Text>
              </Link>
            ) : (
              <Text className="font-pregular text-gray-500">@{username}</Text>
            )}
            <Text className="font-plight text-xs text-gray-500 text-right">
              {timeAgo}
            </Text>
          </View>
          <Text className="text-sm text-gray-800 mt-1 font-pregular">
            {response.content}
          </Text>
          <View className="flex-row justify-start mt-2 space-x-4">
            <TouchableOpacity className="mr-4" onPress={handleLike}>
              <View className="p-1 flex-row items-center gap-2">
                <Ionicons
                  name={liked ? "thumbs-up" : "thumbs-up-outline"}
                  size={15}
                  color={liked ? "#588b76" : "gray"}
                />
                <Text className="font-pregular">
                  {likeCount ? likeCount : null}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDislike}>
              <View className="p-1 flex-row items-center gap-2">
                <Ionicons
                  name={disliked ? "thumbs-down" : "thumbs-down-outline"}
                  size={15}
                  color={disliked ? "#588b76" : "gray"}
                />
                <Text className="font-pregular">
                  {dislikeCount ? dislikeCount : null}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="h-[0.5px] bg-gray-200 w-full" />
    </>
  );
};

export default Response;
