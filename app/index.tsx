import React from "react";
import { images } from "@/constants";
import { useToast } from "@/components/ToastProvider";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Text, View, Image, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import Colors from "@/assets/colors/colors";

const { width, height } = Dimensions.get("window");

const RootLayout = () => {
  const { showToast } = useToast();
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/(tabs)/home" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={[
            `${Colors.darkGreen}40`,
            `${Colors.darkGreen}10`,
            "#FFFFFF",
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="w-full h-full px-6 py-8 justify-between">
            {/* Decorative elements */}
            <View 
              className="absolute top-0 right-0 w-24 h-24 rounded-bl-full" 
              style={{ backgroundColor: Colors.darkGreen, opacity: 0.5 }} 
            />
            <View 
              className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full" 
              style={{ backgroundColor: Colors.darkGreen, opacity: 0.4 }} 
            />

            {/* Logo section */}
            <View className="items-center flex-row justify-center mb-2">
              <View className="bg-white rounded-full p-2 shadow-md mr-2">
                <View 
                  className="rounded-full p-2" 
                  style={{ backgroundColor: Colors.darkGreen }}
                >
                  <Ionicons name="leaf-outline" size={24} color="#FFFFFF" />
                </View>
              </View>
              <View>
                <Text style={{ color: Colors.darkGreen }} className="text-3xl font-pbold">
                  AuraThreads
                </Text>
              </View>
            </View>

            {/* Main illustration */}
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

            {/* Content section */}
            <View className="items-center px-2">
              <Text style={{ color: Colors.darkGreen }} className="text-2xl font-pbold mb-1 text-center">
                Your Safe Space
              </Text>
              <Text className="text-md font-pmedium text-gray-600 text-center">
                Share your mental health challenges anonymously with fellow in a supportive community.
              </Text>
            </View>

            {/* CTA Section */}
            <View className="w-full">
              <CustomButton
                title="Get Started"
                handlePress={() => router.push("/onboard")}
                containerStyles={`mb-3 w-full h-14`}
                textStyles="text-white font-pbold"
              />

              <CustomButton
                title="Learn More"
                handlePress={() => showToast("Coming soon!", "info")}
                containerStyles={`w-full h-14 bg-white border-2 border-[${Colors.darkGreen}]`}
                textStyles={`text-[${Colors.darkGreen}] font-pbold`}
              />

              {/* Footer text */}
              <View className="items-center mt-4">
                <Text className="text-xs font-pregular text-gray-500 text-center">
                  Your privacy is our priority
                </Text>
                <View className="flex-row items-center mt-1">
                  <View 
                    className="w-1.5 h-1.5 rounded-full mx-1" 
                    style={{ backgroundColor: Colors.darkGreen, opacity: 0.6 }} 
                  />
                  <View 
                    className="w-1.5 h-1.5 rounded-full mx-1" 
                    style={{ backgroundColor: Colors.darkGreen, opacity: 0.8 }} 
                  />
                  <View 
                    className="w-1.5 h-1.5 rounded-full mx-1" 
                    style={{ backgroundColor: Colors.darkGreen }} 
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RootLayout;