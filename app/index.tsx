import React from "react";
import { images } from "@/constants";
import { useToast } from "@/components/ToastProvider";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Text, View, Image, Dimensions, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import "react-native-gesture-handler";
import registerNNPushToken from "native-notify";

const { width, height } = Dimensions.get("window");

const RootLayout = () => {
  try {
    registerNNPushToken(29438, "zq1jhhUWGWDhHVZRP5yihC");
  } catch (error) {
    console.error("Error registering Native Notify Push Token:", error);
  }

  const { showToast } = useToast();
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/(tabs)/home" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={[
            "rgba(133, 170, 155, 0.4)",
            "rgba(208, 222, 216, 0.9)",
            "#D0DED8",
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="w-full h-full px-6 py-8 justify-between">
            {/* Decorative elements */}
            <View className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-secondary-100 opacity-50" />
            <View className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full bg-secondary-100 opacity-40" />

            {/* Logo section - compact */}
            <View className="items-center flex-row justify-center mb-2">
              <View className="bg-white rounded-full p-2 shadow-md mr-2">
                <View className="bg-secondary-dark rounded-full p-2">
                  <Ionicons name="leaf-outline" size={24} color="#d0ded8" />
                </View>
              </View>
              <View>
                <Text className="text-3xl font-pbold text-secondary-dark">
                  AuraThreads
                </Text>
              </View>
            </View>

            {/* Main illustration - reduced size */}
            <View className="items-center justify-center">
              <View className="bg-white rounded-2xl p-3 shadow-lg">
                <Image
                  source={images.home}
                  style={{
                    width: width * 0.7,
                    height: height * 0.28,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Content section - more compact */}
            <View className="items-center px-2">
              <Text className="text-2xl font-pbold text-secondary-100 mb-1 text-center">
                Your Safe Space
              </Text>
              <Text className="text-md font-pmedium text-gray-600 text-center">
                Enhance you mental health care with online peer support and self-awareness.
              </Text>
            </View>

            {/* CTA Section */}
            <View className="w-full">
              <CustomButton
                title="Get Started"
                handlePress={() => router.push("/sign-in" as any)}
                containerStyles="mb-3 w-full bg-secondary shadow-md h-14"
                textStyles="text-white font-pbold"
              />

              <CustomButton
                title="Learn More"
                handlePress={() => showToast("Coming soon!", "info")}
                containerStyles="w-full bg-white border-2 border-secondary shadow-sm h-14"
                textStyles="text-secondary font-pbold"
              />

              {/* Footer text */}
              <View className="items-center mt-4">
                <Text className="text-xs font-pregular text-gray-500 text-center">
                  Your privacy is our priority
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-secondary-100 mx-1" />
                  <View className="w-1.5 h-1.5 rounded-full bg-secondary mx-1" />
                  <View className="w-1.5 h-1.5 rounded-full bg-secondary-200 mx-1" />
                </View>
              </View>
            </View>
          </View>
          {/* <StatusBar backgroundColor="#1e4635" barStyle="dark-content" /> */}
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
