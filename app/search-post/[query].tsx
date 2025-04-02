import {
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import useAppwrite from "@/lib/appwrite/useAppwrite";
import { useToast } from "@/components/ToastProvider";
import * as Sharing from "expo-sharing";
import LoadingSpinner from "@/components/LoadingSpinner";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { searchPosts } from "@/lib/appwrite/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import Post from "@/components/Post";

const Search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(query, user.$id)
  );
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const navigation = useNavigation();

  const handleViewDetails = async (file: any) => {
    setRefreshing(true);
    try {
      if (file.fileType === "image") {
        const imageUri = `${FileSystem.cacheDirectory}${file.title}.png`;
        const downloadResult = await FileSystem.downloadAsync(
          file.file,
          imageUri
        );

        if (downloadResult.status === 200) {
          await Sharing.shareAsync(imageUri);
        } else {
          showToast("Failed to download the image.", "error");
        }
      } else {
        const fileUri = `${FileSystem.cacheDirectory}${file.title}.pdf`;
        const downloadResult = await FileSystem.downloadAsync(
          file.file,
          fileUri
        );

        if (downloadResult.status === 200) {
          await Sharing.shareAsync(fileUri);
        } else {
          showToast("Failed to download the file.", "error");
        }
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [query]);

  // const renderFilePreview = (file: any) => {
  //   if (file.fileType === "image") {
  //     return (
  //       <Image
  //         source={{ uri: file.file }}
  //         className="w-12 h-12 rounded"
  //         resizeMode="cover"
  //       />
  //     );
  //   } else {
  //     return <Ionicons name="document-text" size={50} color="#00CED1" />;
  //   }
  // };

  const renderPost = ({ item }: { item: any }) => {
    return <Post post={item} />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
        <FlatList
          data={posts}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => await refetch()}
            />
          }
          keyExtractor={(item: any) => item.$id}
          renderItem={renderPost}
          ListHeaderComponent={() => (
            <View className="px-2 py-2">
              <View className="flex-row items-center mb-5">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="mr-2"
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={25}
                    color="black"
                  />
                </TouchableOpacity>
                <Text className="font-pmedium text-xl text-black">
                  Search results
                </Text>
              </View>

              <SearchInput initialQuery={query.toString()} />

              <View className="border-b border-gray-200" />
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No posts found"
              subTitle="No posts found for this search query"
              buttonVisible={true}
            />
          )}
        />
      </SafeAreaView>

      <LoadingSpinner visible={refreshing} />
    </GestureHandlerRootView>
  );
};

export default Search;
