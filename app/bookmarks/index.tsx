import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PostsBookmarks } from '@/components/PostsBookmarks';
import { JournalBookmarks } from '@/components/JournalBookmarks';
import { Stack } from 'expo-router';

const Bookmarks = () => {
  const [selectedTab, setSelectedTab] = useState("posts");

  return (
    <>
      <Stack.Screen
        name="Bookmarks"
        options={{
          title: 'Bookmarks',
          headerTitleAlign: 'center',
        }}
      />
      <View className="flex-1">
        <View className="flex-row justify-around bg-white py-2.5">
          <TouchableOpacity
            className="items-center"
            onPress={() => {
              setSelectedTab("posts");
            }}
          >
            <Text
              className={
                selectedTab === "posts"
                  ? "text-green-600 font-pbold"
                  : "text-gray-500 font-pregular"
              }
            >
              Posts
            </Text>
            {selectedTab === "posts" && (
              <View className="h-0.5 w-8 bg-green-600 mt-1" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() => {
              setSelectedTab("journal");
            }}
          >
            <Text
              className={
                selectedTab === "journal"
                  ? "text-green-600 font-pbold"
                  : "text-gray-500 font-pregular"
              }
            >
              Journal
            </Text>
            {selectedTab === "journal" && (
              <View className="h-0.5 w-8 bg-green-600 mt-1" />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          {selectedTab === "posts" ? <PostsBookmarks /> : <JournalBookmarks />}
        </View>
      </View>
    </>
  );
};

export default Bookmarks;
