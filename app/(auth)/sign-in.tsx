import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, router } from "expo-router";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
import { images } from "@/constants";
import { useToast } from "@/components/ToastProvider";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimForm = useRef(new Animated.Value(30)).current;

  // Start animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimForm, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setIsSubmitting(true);

    // Placeholder for future authentication logic
    try {
      // Login logic will be implemented later
      console.log("Login attempt with:", values.username);

      // Simulate API call delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);

      router.replace("/home");
    } catch (error: any) {
      showToast("An error occurred", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={["rgba(255, 192, 203, 0.3)", "#FFFFFF"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative elements */}
          <View className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-secondary-100 opacity-40" />
          <View className="absolute bottom-0 left-0 w-40 h-40 rounded-tr-full bg-secondary-100 opacity-40" />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 justify-between items-center p-6">
                {/* Top Logo and Brand */}
                <View className="w-full items-center mt-6">
                  <View className="bg-white rounded-full p-2 shadow-md mb-4">
                    <View className="bg-secondary-100 rounded-full p-2">
                      <Ionicons name="leaf-outline" size={28} color="#F032DA" />
                    </View>
                  </View>
                  <Text className="text-3xl font-pbold text-center">
                    Welcome back to{" "}
                    <Text className="text-secondary font-pextrabold">
                      AuraThreads
                    </Text>
                  </Text>
                  <Text className="text-gray-600 font-pmedium text-center text-base mt-2">
                    Connect with your community
                  </Text>
                </View>

                {/* Login Form */}
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnimForm }],
                    width: "100%",
                  }}
                  className="w-full"
                >
                  <View className="bg-white rounded-2xl p-6 shadow-md w-full">
                    <Formik
                      initialValues={{ username: "", password: "" }}
                      validationSchema={validationSchema}
                      onSubmit={(values) => handleSubmit(values)}
                    >
                      {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                      }) => (
                        <>
                          <FormField
                            title="Username"
                            value={values.username}
                            handleChangeText={handleChange("username")}
                            placeholder="Enter your username"
                            otherStyles="mb-1"
                          />
                          {touched.username && errors.username && (
                            <Text className="text-red-500 text-sm mb-3">
                              {errors.username}
                            </Text>
                          )}

                          <FormField
                            title="Password"
                            value={values.password}
                            handleChangeText={handleChange("password")}
                            placeholder="Enter your password"
                            otherStyles="mt-5"
                          />
                          {touched.password && errors.password && (
                            <Text className="text-red-500 text-sm">
                              {errors.password}
                            </Text>
                          )}

                          {/* <View className="justify-end mt-2 flex-row">
                            <Link
                              href="/forgot-password"
                              className="text-secondary text-sm font-psemibold"
                            >
                              Forgot your password?
                            </Link>
                          </View> */}

                          {isSubmitting ? (
                            <View className="flex-row justify-center mt-6">
                              <ButtonLoadAnimation />
                            </View>
                          ) : (
                            <CustomButton
                              title="Login"
                              handlePress={handleSubmit}
                              containerStyles="mt-6 bg-secondary rounded-full h-14"
                              textStyles="text-white font-pbold text-lg"
                            />
                          )}
                        </>
                      )}
                    </Formik>
                  </View>
                </Animated.View>

                {/* Bottom Sign Up Link */}
                <View className="w-full items-center mb-4">
                  <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-700 font-pregular">
                      Don't have an account?
                    </Text>
                    <Link
                      href="/sign-up"
                      className="text-secondary font-psemibold ml-1"
                    >
                      Sign Up
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

export default Login;
