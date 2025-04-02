import React, { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps {
  initialQuery?: string;
  placeholderText?: string;
}

const SearchInput = ({ initialQuery, placeholderText }: SearchInputProps) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="border border-gray-300 mb-4 w-full h-12 px-4 bg-gray-100 rounded-xl flex-row items-center">
      <TextInput
        className="flex-1 text-black font-pregular text-base"
        value={query}
        placeholder={placeholderText || "Search for something..."}
        placeholderTextColor="gray"
        onChangeText={(text: string) => setQuery(text)}
        style={{
          paddingVertical: 0,
          lineHeight: 20,
          textAlignVertical: "center",
        }}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert("Please enter something to search");
          }

          if (pathName.startsWith("/search-post")) {
            router.setParams({ query });
          } else {
            router.push(`/search-post/${query}` as any);
            setQuery("");
          }
        }}
        className="ml-2"
      >
        <Ionicons name="search-outline" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
