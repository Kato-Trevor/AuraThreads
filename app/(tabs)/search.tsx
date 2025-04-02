import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";

const search = () => {
  return (
    <SafeAreaView>
      <SearchInput />
    </SafeAreaView>
  );
};

export default search;

const styles = StyleSheet.create({});
