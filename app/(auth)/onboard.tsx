import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import Colors from "@/assets/colors/colors";

const { width, height } = Dimensions.get("window");

const Onboard = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimTitle = useRef(new Animated.Value(50)).current;
  const slideAnimImage = useRef(new Animated.Value(30)).current;
  const slideAnimButtons = useRef(new Animated.Value(50)).current;

  // Start animations on component mount
  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimTitle, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnimImage, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimButtons, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={[`${Colors.darkGreen}30`, "#FFFFFF"]} // Adds 30% opacity to darkGreen
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative elements */}
          <View 
            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.4 }} 
          />
          <View 
            className="absolute bottom-0 left-0 w-40 h-40 rounded-tr-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.4 }} 
          />

          <View className="flex-1 justify-between items-center p-6">
            {/* Top Section - Logo and Title */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnimTitle }],
              }}
              className="w-full items-center mt-8"
            >
              <View className="bg-white rounded-full p-2 shadow-md mb-4">
                <View 
                  className="rounded-full p-2" 
                  style={{ backgroundColor: Colors.darkGreen }}
                >
                  <Ionicons name="leaf-outline" size={28} color="#ffffff" />
                </View>
              </View>
              <Text className="text-4xl font-pbold text-center">
                {/* Welcome to{" "} */}
                <Text style={{ color: Colors.darkGreen }} className="font-pextrabold">
                  AuraThreads
                </Text>
              </Text>
              <Text className="text-gray-600 font-pmedium text-center text-base mt-2 px-6">
                Your safe space
              </Text>
            </Animated.View>

            {/* Middle Section - Illustration */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnimImage }],
              }}
              className="w-full items-center"
            >
              <View className="bg-white rounded-2xl p-4 shadow-lg">
                <Image
                  source={images.signup}
                  style={{
                    width: width * 0.8,
                    height: height * 0.28,
                  }}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            {/* Bottom Section - Buttons */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnimButtons }],
                width: "100%",
              }}
            >
             <View className="w-full space-y-3 mb-6">
                <CustomButton
                  title="Get Started"
                  handlePress={() => router.push("/sign-up" as any)}
                  containerStyles={`w-full rounded-full h-14 bg-[${Colors.darkGreen}] shadow-sm shadow-[${Colors.darkGreen}]/50`}
                  textStyles="text-white font-pbold text-lg"
                />

                <CustomButton
                  title="I already have an account"
                  handlePress={() => router.push("/sign-in" as any)}
                  containerStyles={`w-full bg-white border-2 border-[${Colors.darkGreen}] rounded-full mt-2 h-14`}
                  textStyles={`text-[${Colors.darkGreen}] font-psemibold`}
                />

                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-[1px] bg-gray-300" />
                  <Text className="mx-4 text-gray-500 font-pregular">
                    or continue with
                  </Text>
                  <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                <TouchableOpacity
                  onPress={() => router.replace("/" as any)}
                  className="mt-6"
                >
                  <View className="flex justify-center items-center">
                    <Text 
                      className="text-center text-base font-psemibold" 
                      style={{ color: Colors.darkGreen }}
                    >
                      Skip for now
                    </Text>
                    <View 
                      className="h-0.5 w-20 mt-1 rounded-full" 
                      style={{ backgroundColor: Colors.darkGreen }} 
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Onboard;