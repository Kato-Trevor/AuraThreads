
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
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
import { useToast } from "@/components/ToastProvider";
import { getCurrentUser, signIn } from "@/lib/appwrite/auth";
import { useGlobalContext } from "@/context/GlobalProvider";
import Colors from "@/assets/colors/colors";



const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});


const Login = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimForm = useRef(new Animated.Value(30)).current;

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

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error:any) {
      console.error("Error logging in:", error);
      showToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={[`${Colors.darkGreen}30`, "#FFFFFF"]}
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

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 justify-between items-center p-6">
                {/* Top Logo and Brand */}
                <View className="w-full items-center mt-6">
                  <View className="bg-white rounded-full p-2 shadow-md mb-4">
                    <View 
                      className="rounded-full p-2" 
                      style={{ backgroundColor: Colors.darkGreen }}
                    >
                      <Ionicons name="leaf-outline" size={28} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text className="text-3xl font-pbold text-center">
                    <Text style={{ color: Colors.darkGreen }} className="font-pextrabold">
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
                      initialValues={{ email: "", password: "" }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <>
                          <FormField
                            title="Email"
                            value={values.email}
                            handleChangeText={handleChange("email")}
                            placeholder="Enter your email"
                            otherStyles="mb-1"
                          />
                          {touched.email && errors.email && (
                            <Text className="text-red-500 text-sm mb-3">
                              {errors.email}
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

                          {isSubmitting ? (
                            <View className="flex-row justify-center mt-6">
                              <ButtonLoadAnimation />
                            </View>
                          ) : (
                            <CustomButton
                              title="Login"
                              handlePress={handleSubmit}
                              containerStyles={`mt-6 rounded-full h-14 bg-[${Colors.darkGreen}]`}
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
                      style={{ color: Colors.darkGreen }}
                      className="font-psemibold ml-1"
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