import {
    Text,
    View,
    ScrollView,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState, useCallback } from "react";
  import { useGlobalContext } from "@/context/GlobalProvider";
  import { getBookmarksByUserID } from "@/lib/appwrite/bookmarks";
  import Post from "@/components/Post";
  
  export const PostsBookmarks = () => {
    const { user } = useGlobalContext();
    const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchBookmarkedPosts = useCallback(async () => {
      try {
        setIsLoading(true);
        if (!user?.$id) return;
        
        const bookmarks = await getBookmarksByUserID(user.$id);
        
        // Filter and map bookmarks to include both post and bookmark date
        const postBookmarks = bookmarks
          .filter(bookmark => bookmark.postId && bookmark.$createdAt)
          .map(bookmark => ({
            post: bookmark.postId,
            bookmarkDate: bookmark.$createdAt
          }));
        
        // Sort by bookmark date (newest first)
        const sortedBookmarks = postBookmarks.sort((a, b) => 
          new Date(b.bookmarkDate).getTime() - new Date(a.bookmarkDate).getTime()
        );
        
        // Extract just the posts in sorted order
        const sortedPosts = sortedBookmarks.map(item => item.post);
        setBookmarkedPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error);
      } finally {
        setIsLoading(false);
      }
    }, [user?.$id]);
  
    useEffect(() => {
      fetchBookmarkedPosts();
    }, [fetchBookmarkedPosts]);
  
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#18392b" />
        </View>
      );
    }
  
    return (
      <ScrollView className="flex-1 bg-white">
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => (
            <Post key={post.$id} post={post} />
          ))
        ) : (
          <View className="py-8 items-center">
            <Text className="text-gray-500">No bookmarked posts yet</Text>
          </View>
        )}
      </ScrollView>
    );
  };