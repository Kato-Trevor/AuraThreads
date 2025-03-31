import React from "react";
import { router } from "expo-router";
import CustomButton from "./CustomButton";
import { View, Text } from "react-native";

interface EmptyStateProps {
  title: string;
  subTitle: string;
  buttonVisible?: boolean;
}

const EmptyState = ({ title, subTitle, buttonVisible }: EmptyStateProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 24,
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#E0E0E0",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 36, color: "#9E9E9E" }}>?</Text>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          textAlign: "center",
          color: "#000",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "400",
          textAlign: "center",
          color: "#757575",
          marginBottom: 16,
        }}
      >
        {subTitle}
      </Text>

      {/* {buttonVisible && (
        <CustomButton
          title="Upload a document"
          handlePress={() => router.push("/upload")}
          containerStyles={{
            marginTop: 16,
            width: "100%",
            backgroundColor: "#6200EE",
            paddingVertical: 12,
            borderRadius: 8,
          }}
          textStyles={{
            color: "#FFF",
            textAlign: "center",
            fontWeight: "600",
          }}
        />
      )} */}
    </View>
  );
};

export default EmptyState;
