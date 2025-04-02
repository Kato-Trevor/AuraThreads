import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { Link, router } from "expo-router";

import { useToast } from "@/components/ToastProvider";
import { createUser } from "@/lib/appwrite/auth";
import { useGlobalContext } from "@/context/GlobalProvider";
import CounselorSignUpForm from "@/components/CounselorSignUpForm";
import StudentSignUpForm from "@/components/StudentSignUpForm";

Dimensions.get("window");

const Signup = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const { showToast } = useToast();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimForm = useRef(new Animated.Value(30)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const tabsAnim = useRef(new Animated.Value(0)).current;

  // Start animations on component mount
  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(tabsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimForm, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Tab change animation
  const handleTabChange = (tab: any) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimForm, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimForm, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSubmit = async (values: UserModel) => {
    setIsSubmitting(true);

    try {
      const result = await createUser(values);
      setUser(result);
      setIsLoggedIn(true);
      showToast("Account created successfully", "success");
      setIsSubmitting(false);

      router.replace("/home");
    } catch (error: any) {
      console.log("An error occurred: ", error);
      showToast("An error occurred", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={["rgba(255, 192, 203, 0.3)", "#FFFFFF"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Enhanced decorative elements */}
          <View className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-secondary-100 opacity-30" />
          <View className="absolute top-20 left-0 w-24 h-24 rounded-tr-full bg-secondary-100 opacity-20" />
          <View className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full bg-secondary-100 opacity-30" />
          <View className="absolute bottom-24 right-0 w-32 h-32 rounded-tl-full bg-secondary-100 opacity-20" />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 justify-between items-center px-6 py-4">
                {/* Enhanced Top Logo and Brand */}
                <Animated.View
                  className="w-full items-center mt-2"
                  style={{
                    opacity: logoAnim,
                    transform: [
                      {
                        translateY: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <View className="bg-white rounded-full p-3 shadow-lg mb-4">
                    <View className="bg-secondary-100 rounded-full p-3">
                      <Ionicons name="leaf-outline" size={32} color="#FFE4E1" />
                    </View>
                  </View>
                  <Text className="text-3xl font-pbold text-center">
                    Welcome to{" "}
                    <Text className="text-secondary font-pextrabold">
                      AuraThreads
                    </Text>
                  </Text>
                  <Text className="text-gray-600 font-pmedium text-center text-base mt-2 mb-2">
                    Your journey to better mental health begins here
                  </Text>
                </Animated.View>

                {/* Enhanced Tabs */}
                <TabSelector
                  activeTab={activeTab}
                  handleTabChange={handleTabChange}
                />

                {/* Enhanced Signup Form */}
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnimForm }],
                    width: "100%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                  className="w-full mt-2"
                >
                  <View className="bg-white rounded-3xl p-6 shadow-md w-full">
                    <View className="mb-4">
                      <Text className="text-lg font-pbold text-secondary mb-1">
                        {activeTab === "student"
                          ? "Student Registration"
                          : "Counselor Registration"}
                      </Text>
                      <Text className="text-gray-500 text-sm font-pregular">
                        {activeTab === "student"
                          ? "Connect with certified counselors"
                          : "Help students on their mental health journey"}
                      </Text>
                    </View>

                    {activeTab === "student" ? (
                      <StudentSignUpForm
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                    ) : (
                      <CounselorSignUpForm
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </View>
                </Animated.View>

                {/* Bottom Login Link */}
                <View className="w-full items-center mb-4">
                  <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-700 font-pregular">
                      Already have an account?
                    </Text>
                    <Link
                      href="/sign-in"
                      className="text-secondary font-psemibold ml-1"
                    >
                      Login
                    </Link>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Signup;

const TabSelector = ({ activeTab, handleTabChange }: any) => {
  const tabsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(tabsAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      className="w-full"
      style={{
        opacity: tabsAnim,
        transform: [
          {
            translateY: tabsAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      <View className="flex-row justify-center items-center bg-gray-100 rounded-lg p-1">
        <TouchableOpacity
          onPress={() => handleTabChange("student")}
          className={`flex-1 py-3 ${
            activeTab === "student"
              ? "bg-secondary rounded-lg shadow-sm"
              : "bg-transparent"
          }`}
          style={{
            elevation: activeTab === "student" ? 2 : 0,
          }}
        >
          <View className="flex-row justify-center items-center">
            <Ionicons
              name="school-outline"
              size={18}
              color={activeTab === "student" ? "#fff" : "#666"}
            />
            <Text
              className={`font-psemibold ml-2 ${
                activeTab === "student" ? "text-white" : "text-gray-600"
              }`}
            >
              Student
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("counselor")}
          className={`flex-1 py-3 ${
            activeTab === "counselor"
              ? "bg-secondary rounded-lg shadow-sm"
              : "bg-transparent"
          }`}
          style={{
            elevation: activeTab === "counselor" ? 2 : 0,
          }}
        >
          <View className="flex-row justify-center items-center">
            <Ionicons
              name="medical-outline"
              size={18}
              color={activeTab === "counselor" ? "#fff" : "#666"}
            />
            <Text
              className={`font-psemibold ml-2 ${
                activeTab === "counselor" ? "text-white" : "text-gray-600"
              }`}
            >
              Counselor
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
