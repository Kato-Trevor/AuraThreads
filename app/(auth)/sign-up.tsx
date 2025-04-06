// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
// } from "react-native";
// import {
//   ScrollView,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { Link, router } from "expo-router";
// import FormField from "@/components/FormField";
// import CustomButton from "@/components/CustomButton";
// import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
// import { images } from "@/constants";
// import { useToast } from "@/components/ToastProvider";
// import { createUser } from "@/lib/appwrite/auth";
// import { useGlobalContext } from "@/context/GlobalProvider";
// import Colors from "@/assets/colors/colors";


// const { width, height } = Dimensions.get("window");

// const studentValidationSchema = Yup.object().shape({
//   username: Yup.string()
//     .min(3, "Username must be at least 3 characters")
//     .required("Username is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
// });

// const counselorValidationSchema = Yup.object().shape({
//   username: Yup.string()
//     .min(3, "Username must be at least 3 characters")
//     .required("Username is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   phone: Yup.string()
//     .min(10, "Phone number must be at least 10 digits")
//     .required("Phone number is required"),
//   qualification: Yup.string().required("Qualification is required"),
// });

// const Signup = () => {
//   const { setUser, setIsLoggedIn } = useGlobalContext();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState("student");
//   const { showToast } = useToast();

//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnimForm = useRef(new Animated.Value(30)).current;
//   const logoAnim = useRef(new Animated.Value(0)).current;
//   const tabsAnim = useRef(new Animated.Value(0)).current;

//   // Start animations on component mount
//   useEffect(() => {
//     Animated.sequence([
//       Animated.timing(logoAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(tabsAnim, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnimForm, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();
//   }, []);

//   // Tab change animation
//   const handleTabChange = (tab: any) => {
//     Animated.sequence([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnimForm, {
//         toValue: 20,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setActiveTab(tab);
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnimForm, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     });
//   };

//   const handleSubmit = async (values: {
//     username: string;
//     password: string;
//     email: string;
//   }) => {
//     setIsSubmitting(true);

//     try {
//       const userData = {
//         username: values.username,
//         email: values.email,
//         password: values.password,
//         role: (activeTab === "student") ? "student" : "counselor",
//       }
      
//       const result = await createUser(userData);
//       setUser(result);
//       setIsLoggedIn(true);
//       showToast("Account created successfully", "success");
//       setIsSubmitting(false);

//       router.replace("/home");
//     } catch (error: any) {
//       console.log("An error occurred: ", error);
//       showToast("An error occurred", "error");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="transparent"
//         translucent
//       />
//       <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
//         <LinearGradient
//           colors={["rgba(255, 192, 203, 0.3)", "#FFFFFF"]}
//           style={{ flex: 1 }}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           {/* Enhanced decorative elements */}
//           <View className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-secondary-100 opacity-30" />
//           <View className="absolute top-20 left-0 w-24 h-24 rounded-tr-full bg-secondary-100 opacity-20" />
//           <View className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full bg-secondary-100 opacity-30" />
//           <View className="absolute bottom-24 right-0 w-32 h-32 rounded-tl-full bg-secondary-100 opacity-20" />

//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{ flex: 1 }}
//           >
//             <ScrollView
//               contentContainerStyle={{ flexGrow: 1 }}
//               showsVerticalScrollIndicator={false}
//             >
//               <View className="flex-1 justify-between items-center px-6 py-4">
//                 {/* Enhanced Top Logo and Brand */}
//                 <Animated.View
//                   className="w-full items-center mt-2"
//                   style={{
//                     opacity: logoAnim,
//                     transform: [
//                       {
//                         translateY: logoAnim.interpolate({
//                           inputRange: [0, 1],
//                           outputRange: [-20, 0],
//                         }),
//                       },
//                     ],
//                   }}
//                 >
//                   <View className="bg-white rounded-full p-3 shadow-lg mb-4">
//                     <View className="bg-secondary-100 rounded-full p-3">
//                       <Ionicons name="leaf-outline" size={32} color="#FFE4E1" />
//                     </View>
//                   </View>
//                   <Text className="text-3xl font-pbold text-center">
//                     Welcome to{" "}
//                     <Text className="text-secondary font-pextrabold">
//                       AuraThreads
//                     </Text>
//                   </Text>
//                   <Text className="text-gray-600 font-pmedium text-center text-base mt-2 mb-2">
//                     Your journey to better mental health begins here
//                   </Text>
//                 </Animated.View>

//                 {/* Enhanced Tabs */}
//                 <TabSelector
//                   activeTab={activeTab}
//                   handleTabChange={handleTabChange}
//                 />

//                 {/* Enhanced Signup Form */}
//                 <Animated.View
//                   style={{
//                     opacity: fadeAnim,
//                     transform: [{ translateY: slideAnimForm }],
//                     width: "100%",
//                     shadowColor: "#000",
//                     shadowOffset: { width: 0, height: 5 },
//                     shadowOpacity: 0.1,
//                     shadowRadius: 8,
//                     elevation: 5,
//                   }}
//                   className="w-full mt-2"
//                 >
//                   <View className="bg-white rounded-3xl p-6 shadow-md w-full">
//                     <View className="mb-4">
//                       <Text className="text-lg font-pbold text-secondary mb-1">
//                         {activeTab === "student"
//                           ? "Student Registration"
//                           : "Counselor Registration"}
//                       </Text>
//                       <Text className="text-gray-500 text-sm font-pregular">
//                         {activeTab === "student"
//                           ? "Connect with certified counselors"
//                           : "Help students on their mental health journey"}
//                       </Text>
//                     </View>

//                     {activeTab === "student" ? (
//                       <Formik
//                         initialValues={{
//                           username: "",
//                           password: "",
//                           email: "",
//                         }}
//                         validationSchema={studentValidationSchema}
//                         onSubmit={(values) => handleSubmit(values)}
//                       >
//                         {({
//                           handleChange,
//                           handleSubmit,
//                           values,
//                           errors,
//                           touched,
//                         }) => (
//                           <>
//                             <FormField
//                               title="Username"
//                               value={values.username}
//                               handleChangeText={handleChange("username")}
//                               placeholder="Enter your username"
//                               otherStyles="mb-1"
//                             />
//                             {touched.username && errors.username && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.username}
//                               </Text>
//                             )}

//                             <FormField
//                               title="Email"
//                               value={values.email}
//                               handleChangeText={handleChange("email")}
//                               placeholder="Enter your email"
//                               otherStyles="mb-1"
//                             />
//                             {touched.email && errors.email && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.email}
//                               </Text>
//                             )}

//                             <FormField
//                               title="Password"
//                               value={values.password}
//                               handleChangeText={handleChange("password")}
//                               placeholder="Enter your password"
//                               otherStyles="mt-5"
//                             />
//                             {touched.password && errors.password && (
//                               <Text className="text-red-500 text-sm">
//                                 {errors.password}
//                               </Text>
//                             )}

//                             {isSubmitting ? (
//                               <View className="flex-row justify-center mt-6">
//                                 <ButtonLoadAnimation />
//                               </View>
//                             ) : (
//                               <CustomButton
//                                 title="Sign Up"
//                                 handlePress={handleSubmit}
//                                 containerStyles="mt-6 bg-secondary rounded-full h-14"
//                                 textStyles="text-white font-pbold text-lg"
//                               />
//                             )}
//                           </>
//                         )}
//                       </Formik>
//                     ) : (
//                       <Formik
//                         initialValues={{
//                           username: "",
//                           password: "",
//                           email: "",
//                           phone: "",
//                           qualification: "",
//                         }}
//                         validationSchema={counselorValidationSchema}
//                         onSubmit={(values) => handleSubmit(values)}
//                       >
//                         {({
//                           handleChange,
//                           handleSubmit,
//                           values,
//                           errors,
//                           touched,
//                         }) => (
//                           <>
//                             <FormField
//                               title="Username"
//                               value={values.username}
//                               handleChangeText={handleChange("username")}
//                               placeholder="Enter your username"
//                               otherStyles="mb-1"
//                             />
//                             {touched.username && errors.username && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.username}
//                               </Text>
//                             )}

//                             <FormField
//                               title="Email"
//                               value={values.email}
//                               handleChangeText={handleChange("email")}
//                               placeholder="Enter your email"
//                               otherStyles="mb-1"
//                             />
//                             {touched.email && errors.email && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.email}
//                               </Text>
//                             )}
//                             <FormField
//                               title="Phone"
//                               value={values.phone}
//                               handleChangeText={handleChange("phone")}
//                               placeholder="Enter your phone number"
//                               otherStyles="mb-1"
//                             />
//                             {touched.phone && errors.phone && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.phone}
//                               </Text>
//                             )}

//                             <FormField
//                               title="Qualification"
//                               value={values.qualification}
//                               handleChangeText={handleChange("qualification")}
//                               placeholder="Enter your qualification"
//                               otherStyles="mb-1"
//                             />
//                             {touched.qualification && errors.qualification && (
//                               <Text className="text-red-500 text-sm mb-3">
//                                 {errors.qualification}
//                               </Text>
//                             )}

//                             <FormField
//                               title="Password"
//                               value={values.password}
//                               handleChangeText={handleChange("password")}
//                               placeholder="Enter your password"
//                               otherStyles="mt-5"
//                             />
//                             {touched.password && errors.password && (
//                               <Text className="text-red-500 text-sm">
//                                 {errors.password}
//                               </Text>
//                             )}

//                             {isSubmitting ? (
//                               <View className="flex-row justify-center mt-6">
//                                 <ButtonLoadAnimation />
//                               </View>
//                             ) : (
//                               <CustomButton
//                                 title="Sign Up"
//                                 handlePress={handleSubmit}
//                                 containerStyles="mt-6 bg-secondary rounded-full h-14"
//                                 textStyles="text-white font-pbold text-lg"
//                               />
//                             )}
//                           </>
//                         )}
//                       </Formik>
//                     )}
//                   </View>
//                 </Animated.View>

//                 {/* Bottom Login Link */}
//                 <View className="w-full items-center mb-4">
//                   <View className="flex-row justify-center items-center mt-6">
//                     <Text className="text-gray-700 font-pregular">
//                       Already have an account?
//                     </Text>
//                     <Link
//                       href="/sign-in"
//                       className="text-secondary font-psemibold ml-1"
//                     >
//                       Login
//                     </Link>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </LinearGradient>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default Signup;

// const TabSelector = ({ activeTab, handleTabChange }: any) => {
//   const tabsAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(tabsAnim, {
//       toValue: 1,
//       duration: 400,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <Animated.View
//       className="w-full"
//       style={{
//         opacity: tabsAnim,
//         transform: [
//           {
//             translateY: tabsAnim.interpolate({
//               inputRange: [0, 1],
//               outputRange: [10, 0],
//             }),
//           },
//         ],
//       }}
//     >
//       <View className="flex-row justify-center items-center bg-gray-100 rounded-lg p-1">
//         <TouchableOpacity
//           onPress={() => handleTabChange("student")}
//           className={`flex-1 py-3 ${
//             activeTab === "student"
//               ? "bg-secondary rounded-lg shadow-sm"
//               : "bg-transparent"
//           }`}
//           style={{
//             elevation: activeTab === "student" ? 2 : 0,
//           }}
//         >
//           <View className="flex-row justify-center items-center">
//             <Ionicons
//               name="school-outline"
//               size={18}
//               color={activeTab === "student" ? "#fff" : "#666"}
//             />
//             <Text
//               className={`font-psemibold ml-2 ${
//                 activeTab === "student" ? "text-white" : "text-gray-600"
//               }`}
//             >
//               Student
//             </Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => handleTabChange("counselor")}
//           className={`flex-1 py-3 ${
//             activeTab === "counselor"
//               ? "bg-secondary rounded-lg shadow-sm"
//               : "bg-transparent"
//           }`}
//           style={{
//             elevation: activeTab === "counselor" ? 2 : 0,
//           }}
//         >
//           <View className="flex-row justify-center items-center">
//             <Ionicons
//               name="medical-outline"
//               size={18}
//               color={activeTab === "counselor" ? "#fff" : "#666"}
//             />
//             <Text
//               className={`font-psemibold ml-2 ${
//                 activeTab === "counselor" ? "text-white" : "text-gray-600"
//               }`}
//             >
//               Counselor
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );
// };







// user

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
// } from "react-native";
// import {
//   ScrollView,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { Link, router } from "expo-router";
// import FormField from "@/components/FormField";
// import CustomButton from "@/components/CustomButton";
// import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
// import { useToast } from "@/components/ToastProvider";
// import { createUser } from "@/lib/appwrite/auth";
// import { useGlobalContext } from "@/context/GlobalProvider";
// import Colors from "@/assets/colors/colors";

// const Signup = () => {
//   const { setUser, setIsLoggedIn } = useGlobalContext();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState<"User" | "counselor">("User");
//   const { showToast } = useToast();

//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnimForm = useRef(new Animated.Value(30)).current;
//   const logoAnim = useRef(new Animated.Value(0)).current;
//   const tabsAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.timing(logoAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(tabsAnim, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnimForm, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();
//   }, []);

//   const handleTabChange = (tab: "User" | "counselor") => {
//     Animated.sequence([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnimForm, {
//         toValue: 20,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setActiveTab(tab);
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnimForm, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     });
//   };

//   const handleSubmit = async (values: {
//     username: string;
//     password: string;
//     email: string;
//     phone?: string;
//     qualification?: string;
//   }) => {
//     setIsSubmitting(true);
//     try {
//       const userData = {
//         username: values.username,
//         email: values.email,
//         password: values.password,
//         role: activeTab,
//         ...(activeTab === "counselor" && {
//           phone: values.phone,
//           qualification: values.qualification
//         })
//       };
      
//       const result = await createUser(userData);
//       setUser(result);
//       setIsLoggedIn(true);
//       showToast("Account created successfully", "success");
//       router.replace("/home");
//     } catch (error) {
//       showToast("An error occurred", "error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//       <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
//         <LinearGradient
//           colors={[`${Colors.darkGreen}30`, "#FFFFFF"]}
//           style={{ flex: 1 }}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           {/* Decorative elements */}
//           <View className="absolute top-0 right-0 w-40 h-40 rounded-bl-full" 
//             style={{ backgroundColor: Colors.darkGreen, opacity: 0.3 }} />
//           <View className="absolute top-20 left-0 w-24 h-24 rounded-tr-full" 
//             style={{ backgroundColor: Colors.darkGreen, opacity: 0.2 }} />
//           <View className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full" 
//             style={{ backgroundColor: Colors.darkGreen, opacity: 0.3 }} />
//           <View className="absolute bottom-24 right-0 w-32 h-32 rounded-tl-full" 
//             style={{ backgroundColor: Colors.darkGreen, opacity: 0.2 }} />

//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{ flex: 1 }}
//           >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
//               <View className="flex-1 justify-between items-center px-6 py-4">
//                 {/* Logo and Brand */}
//                 <Animated.View
//                   className="w-full items-center mt-2"
//                   style={{
//                     opacity: logoAnim,
//                     transform: [{
//                       translateY: logoAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [-20, 0],
//                       }),
//                     }],
//                   }}
//                 >
//                   <View className="bg-white rounded-full p-3 shadow-lg mb-4">
//                     <View className="rounded-full p-3" style={{ backgroundColor: Colors.darkGreen }}>
//                       <Ionicons name="leaf-outline" size={32} color="#FFFFFF" />
//                     </View>
//                   </View>
//                   <Text className="text-3xl font-pbold text-center">
//                     {/* Welcome to{" "} */}
//                     <Text style={{ color: Colors.darkGreen }} className="font-pextrabold">
//                       AuraThreads
//                     </Text>
//                   </Text>
//                   <Text className="text-gray-600 font-pmedium text-center text-base mt-2 mb-2">
//                     Your journey to better mental health begins here
//                   </Text>
//                 </Animated.View>

//                 {/* Tabs */}
//                 <TabSelector activeTab={activeTab} handleTabChange={handleTabChange} />

//                 {/* Signup Form */}
//                 <Animated.View
//                   style={{
//                     opacity: fadeAnim,
//                     transform: [{ translateY: slideAnimForm }],
//                     width: "100%",
//                   }}
//                   className="w-full mt-2"
//                 >
//                   <View className="bg-white rounded-3xl p-6 shadow-md w-full">
//                     <View className="mb-4">
//                       <Text style={{ color: Colors.darkGreen }} className="text-lg font-pbold mb-1">
//                         {activeTab === "User" ? "User Registration" : "Counselor Registration"}
//                       </Text>
//                       <Text className="text-gray-500 text-sm font-pregular">
//                         {activeTab === "User"
//                           ? "Connect with certified counselors"
//                           : "Help users with their mental health journeys"}
//                       </Text>
//                     </View>

//                     {activeTab === "User" ? (
//                       <UserForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
//                     ) : (
//                       <CounselorForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
//                     )}
//                   </View>
//                 </Animated.View>

//                 {/* Login Link */}
//                 <View className="w-full items-center mb-4">
//                   <View className="flex-row justify-center items-center mt-6">
//                     <Text className="text-gray-700 font-pregular">
//                       Already have an account?
//                     </Text>
//                     <Link
//                       href="/sign-in"
//                       style={{ color: Colors.darkGreen }}
//                       className="font-psemibold ml-1"
//                     >
//                       Login
//                     </Link>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </LinearGradient>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// // Form Components
// const UserForm = ({ isSubmitting, onSubmit }: { 
//   isSubmitting: boolean; 
//   onSubmit: (values: { username: string; password: string; email: string }) => void 
// }) => (
//   <Formik
//     initialValues={{ username: "", password: "", email: "" }}
//     validationSchema={Yup.object({
//       username: Yup.string().min(3).required(),
//       password: Yup.string().min(6).required(),
//       email: Yup.string().email().required()
//     })}
//     onSubmit={onSubmit}
//   >
//     {({ handleChange, handleSubmit, values, errors, touched }) => (
//       <>
//         <FormField
//           title="Username"
//           value={values.username}
//           handleChangeText={handleChange("username")}
//           placeholder="Enter your username"
//           otherStyles="mb-1"
//         />
//         {touched.username && errors.username && (
//           <Text className="text-red-500 text-sm mb-3">{errors.username}</Text>
//         )}

//         <FormField
//           title="Email"
//           value={values.email}
//           handleChangeText={handleChange("email")}
//           placeholder="Enter your email"
//           otherStyles="mb-1"
//         />
//         {touched.email && errors.email && (
//           <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>
//         )}

//         <FormField
//           title="Password"
//           value={values.password}
//           handleChangeText={handleChange("password")}
//           placeholder="Enter your password"
//           otherStyles="mt-5"
//         />
//         {touched.password && errors.password && (
//           <Text className="text-red-500 text-sm">{errors.password}</Text>
//         )}

//         {isSubmitting ? (
//           <View className="flex-row justify-center mt-6">
//             <ButtonLoadAnimation />
//           </View>
//         ) : (
//           <CustomButton
//             title="Sign Up"
//             handlePress={handleSubmit}
//             containerStyles={`mt-6 rounded-full h-14 bg-[${Colors.darkGreen}]`}
//             textStyles="text-white font-pbold text-lg"
//           />
//         )}
//       </>
//     )}
//   </Formik>
// );

// const CounselorForm = ({ isSubmitting, onSubmit }: { 
//   isSubmitting: boolean; 
//   onSubmit: (values: { 
//     username: string; 
//     password: string; 
//     email: string;
//     phone: string;
//     qualification: string;
//   }) => void 
// }) => (
//   <Formik
//     initialValues={{ 
//       username: "", 
//       password: "", 
//       email: "",
//       phone: "",
//       qualification: ""
//     }}
//     validationSchema={Yup.object({
//       username: Yup.string().min(3).required(),
//       password: Yup.string().min(6).required(),
//       email: Yup.string().email().required(),
//       phone: Yup.string().min(10).required(),
//       qualification: Yup.string().required()
//     })}
//     onSubmit={onSubmit}
//   >
//     {({ handleChange, handleSubmit, values, errors, touched }) => (
//       <>
//         <FormField
//           title="Username"
//           value={values.username}
//           handleChangeText={handleChange("username")}
//           placeholder="Enter your username"
//           otherStyles="mb-1"
//         />
//         {touched.username && errors.username && (
//           <Text className="text-red-500 text-sm mb-3">{errors.username}</Text>
//         )}

//         <FormField
//           title="Email"
//           value={values.email}
//           handleChangeText={handleChange("email")}
//           placeholder="Enter your email"
//           otherStyles="mb-1"
//         />
//         {touched.email && errors.email && (
//           <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>
//         )}

//         <FormField
//           title="Phone"
//           value={values.phone}
//           handleChangeText={handleChange("phone")}
//           placeholder="Enter your phone number"
//           otherStyles="mb-1"
//         />
//         {touched.phone && errors.phone && (
//           <Text className="text-red-500 text-sm mb-3">{errors.phone}</Text>
//         )}

//         <FormField
//           title="Qualification"
//           value={values.qualification}
//           handleChangeText={handleChange("qualification")}
//           placeholder="Enter your qualification"
//           otherStyles="mb-1"
//         />
//         {touched.qualification && errors.qualification && (
//           <Text className="text-red-500 text-sm mb-3">{errors.qualification}</Text>
//         )}

//         <FormField
//           title="Password"
//           value={values.password}
//           handleChangeText={handleChange("password")}
//           placeholder="Enter your password"
//           otherStyles="mt-5"
//         />
//         {touched.password && errors.password && (
//           <Text className="text-red-500 text-sm">{errors.password}</Text>
//         )}

//         {isSubmitting ? (
//           <View className="flex-row justify-center mt-6">
//             <ButtonLoadAnimation />
//           </View>
//         ) : (
//           <CustomButton
//             title="Sign Up"
//             handlePress={handleSubmit}
//             containerStyles={`mt-6 rounded-full h-14 bg-[${Colors.darkGreen}]`}
//             textStyles="text-white font-pbold text-lg"
//           />
//         )}
//       </>
//     )}
//   </Formik>
// );

// // Tab Selector Component
// const TabSelector = ({ 
//   activeTab, 
//   handleTabChange 
// }: { 
//   activeTab: "User" | "counselor"; 
//   handleTabChange: (tab: "User" | "counselor") => void 
// }) => {
//   const tabsAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(tabsAnim, {
//       toValue: 1,
//       duration: 400,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <Animated.View
//       className="w-full"
//       style={{
//         opacity: tabsAnim,
//         transform: [{
//           translateY: tabsAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [10, 0],
//           }),
//         }],
//       }}
//     >
//       <View className="flex-row justify-center items-center bg-gray-100 rounded-lg p-1">
//         <TouchableOpacity
//           onPress={() => handleTabChange("User")}
//           className={`flex-1 py-3 ${activeTab === "User" ? "rounded-lg shadow-sm" : ""}`}
//           style={{
//             backgroundColor: activeTab === "User" ? Colors.darkGreen : "transparent",
//             elevation: activeTab === "User" ? 2 : 0,
//           }}
//         >
//           <View className="flex-row justify-center items-center">
//             <Ionicons
//               name="school-outline"
//               size={18}
//               color={activeTab === "User" ? "#fff" : "#666"}
//             />
//             <Text
//               className={`font-psemibold ml-2 ${activeTab === "User" ? "text-white" : "text-gray-600"}`}
//             >
//               User
//             </Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => handleTabChange("counselor")}
//           className={`flex-1 py-3 ${activeTab === "counselor" ? "rounded-lg shadow-sm" : ""}`}
//           style={{
//             backgroundColor: activeTab === "counselor" ? Colors.darkGreen : "transparent",
//             elevation: activeTab === "counselor" ? 2 : 0,
//           }}
//         >
//           <View className="flex-row justify-center items-center">
//             <Ionicons
//               name="medical-outline"
//               size={18}
//               color={activeTab === "counselor" ? "#fff" : "#666"}
//             />
//             <Text
//               className={`font-psemibold ml-2 ${activeTab === "counselor" ? "text-white" : "text-gray-600"}`}
//             >
//               Counselor
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );
// };

// export default Signup;












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
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, router } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
import { useToast } from "@/components/ToastProvider";
import { createUser } from "@/lib/appwrite/auth";
import { useGlobalContext } from "@/context/GlobalProvider";
import Colors from "@/assets/colors/colors";

const Signup = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"student" | "counselor">("student");
  const { showToast } = useToast();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimForm = useRef(new Animated.Value(30)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const tabsAnim = useRef(new Animated.Value(0)).current;

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

  const handleTabChange = (tab: "student" | "counselor") => {
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

  const handleSubmit = async (values: {
    username: string;
    password: string;
    email: string;
    phone?: string;
    qualification?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: activeTab,
        ...(activeTab === "counselor" && {
          phone: values.phone,
          qualification: values.qualification
        })
      };
      
      const result = await createUser(userData);
      setUser(result);
      setIsLoggedIn(true);
      showToast("Account created successfully", "success");
      router.replace("/home");
    } catch (error) {
      showToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <LinearGradient
          colors={[`${Colors.darkGreen}30`, "#FFFFFF"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative elements */}
          <View className="absolute top-0 right-0 w-40 h-40 rounded-bl-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.3 }} />
          <View className="absolute top-20 left-0 w-24 h-24 rounded-tr-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.2 }} />
          <View className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.3 }} />
          <View className="absolute bottom-24 right-0 w-32 h-32 rounded-tl-full" 
            style={{ backgroundColor: Colors.darkGreen, opacity: 0.2 }} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              <View className="flex-1 justify-between items-center px-6 py-4">
                {/* Logo and Brand */}
                <Animated.View
                  className="w-full items-center mt-2"
                  style={{
                    opacity: logoAnim,
                    transform: [{
                      translateY: logoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    }],
                  }}
                >
                  <View className="bg-white rounded-full p-3 shadow-lg mb-4">
                    <View className="rounded-full p-3" style={{ backgroundColor: Colors.darkGreen }}>
                      <Ionicons name="leaf-outline" size={32} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text className="text-3xl font-pbold text-center">
                    Welcome to{" "}
                    <Text style={{ color: Colors.darkGreen }} className="font-pextrabold">
                      AuraThreads
                    </Text>
                  </Text>
                  <Text className="text-gray-600 font-pmedium text-center text-base mt-2 mb-2">
                    Your journey to better mental health begins here
                  </Text>
                </Animated.View>

                {/* Tabs */}
                <TabSelector activeTab={activeTab} handleTabChange={handleTabChange} />

                {/* Signup Form */}
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnimForm }],
                    width: "100%",
                  }}
                  className="w-full mt-2"
                >
                  <View className="bg-white rounded-3xl p-6 shadow-md w-full">
                    <View className="mb-4">
                      <Text style={{ color: Colors.darkGreen }} className="text-lg font-pbold mb-1">
                        {activeTab === "student" ? "Student Registration" : "Counselor Registration"}
                      </Text>
                      <Text className="text-gray-500 text-sm font-pregular">
                        {activeTab === "student"
                          ? "Connect with certified counselors"
                          : "Help students on their mental health journey"}
                      </Text>
                    </View>

                    {activeTab === "student" ? (
                      <StudentForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
                    ) : (
                      <CounselorForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
                    )}
                  </View>
                </Animated.View>

                {/* Login Link */}
                <View className="w-full items-center mb-4">
                  <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-700 font-pregular">
                      Already have an account?
                    </Text>
                    <Link
                      href="/sign-in"
                      style={{ color: Colors.darkGreen }}
                      className="font-psemibold ml-1"
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

// Form Components
const StudentForm = ({ isSubmitting, onSubmit }: { 
  isSubmitting: boolean; 
  onSubmit: (values: { username: string; password: string; email: string }) => void 
}) => (
  <Formik
    initialValues={{ username: "", password: "", email: "" }}
    validationSchema={Yup.object({
      username: Yup.string().min(3).required(),
      password: Yup.string().min(6).required(),
      email: Yup.string().email().required()
    })}
    onSubmit={onSubmit}
  >
    {({ handleChange, handleSubmit, values, errors, touched }) => (
      <>
        <FormField
          title="Username"
          value={values.username}
          handleChangeText={handleChange("username")}
          placeholder="Enter your username"
          otherStyles="mb-1"
        />
        {touched.username && errors.username && (
          <Text className="text-red-500 text-sm mb-3">{errors.username}</Text>
        )}

        <FormField
          title="Email"
          value={values.email}
          handleChangeText={handleChange("email")}
          placeholder="Enter your email"
          otherStyles="mb-1"
        />
        {touched.email && errors.email && (
          <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>
        )}

        <FormField
          title="Password"
          value={values.password}
          handleChangeText={handleChange("password")}
          placeholder="Enter your password"
          otherStyles="mt-5"
        />
        {touched.password && errors.password && (
          <Text className="text-red-500 text-sm">{errors.password}</Text>
        )}

        {isSubmitting ? (
          <View className="flex-row justify-center mt-6">
            <ButtonLoadAnimation />
          </View>
        ) : (
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles={`mt-6 rounded-full h-14 bg-[${Colors.darkGreen}]`}
            textStyles="text-white font-pbold text-lg"
          />
        )}
      </>
    )}
  </Formik>
);

const CounselorForm = ({ isSubmitting, onSubmit }: { 
  isSubmitting: boolean; 
  onSubmit: (values: { 
    username: string; 
    password: string; 
    email: string;
    phone: string;
    qualification: string;
  }) => void 
}) => (
  <Formik
    initialValues={{ 
      username: "", 
      password: "", 
      email: "",
      phone: "",
      qualification: ""
    }}
    validationSchema={Yup.object({
      username: Yup.string().min(3).required(),
      password: Yup.string().min(6).required(),
      email: Yup.string().email().required(),
      phone: Yup.string().min(10).required(),
      qualification: Yup.string().required()
    })}
    onSubmit={onSubmit}
  >
    {({ handleChange, handleSubmit, values, errors, touched }) => (
      <>
        <FormField
          title="Username"
          value={values.username}
          handleChangeText={handleChange("username")}
          placeholder="Enter your username"
          otherStyles="mb-1"
        />
        {touched.username && errors.username && (
          <Text className="text-red-500 text-sm mb-3">{errors.username}</Text>
        )}

        <FormField
          title="Email"
          value={values.email}
          handleChangeText={handleChange("email")}
          placeholder="Enter your email"
          otherStyles="mb-1"
        />
        {touched.email && errors.email && (
          <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>
        )}

        <FormField
          title="Phone"
          value={values.phone}
          handleChangeText={handleChange("phone")}
          placeholder="Enter your phone number"
          otherStyles="mb-1"
        />
        {touched.phone && errors.phone && (
          <Text className="text-red-500 text-sm mb-3">{errors.phone}</Text>
        )}

        <FormField
          title="Qualification"
          value={values.qualification}
          handleChangeText={handleChange("qualification")}
          placeholder="Enter your qualification"
          otherStyles="mb-1"
        />
        {touched.qualification && errors.qualification && (
          <Text className="text-red-500 text-sm mb-3">{errors.qualification}</Text>
        )}

        <FormField
          title="Password"
          value={values.password}
          handleChangeText={handleChange("password")}
          placeholder="Enter your password"
          otherStyles="mt-5"
        />
        {touched.password && errors.password && (
          <Text className="text-red-500 text-sm">{errors.password}</Text>
        )}

        {isSubmitting ? (
          <View className="flex-row justify-center mt-6">
            <ButtonLoadAnimation />
          </View>
        ) : (
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles={`mt-6 rounded-full h-14 bg-[${Colors.darkGreen}]`}
            textStyles="text-white font-pbold text-lg"
          />
        )}
      </>
    )}
  </Formik>
);

// Tab Selector Component
const TabSelector = ({ 
  activeTab, 
  handleTabChange 
}: { 
  activeTab: "student" | "counselor"; 
  handleTabChange: (tab: "student" | "counselor") => void 
}) => {
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
        transform: [{
          translateY: tabsAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        }],
      }}
    >
      <View className="flex-row justify-center items-center bg-gray-100 rounded-lg p-1">
        <TouchableOpacity
          onPress={() => handleTabChange("student")}
          className={`flex-1 py-3 ${activeTab === "student" ? "rounded-lg shadow-sm" : ""}`}
          style={{
            backgroundColor: activeTab === "student" ? Colors.darkGreen : "transparent",
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
              className={`font-psemibold ml-2 ${activeTab === "student" ? "text-white" : "text-gray-600"}`}
            >
              Student
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("counselor")}
          className={`flex-1 py-3 ${activeTab === "counselor" ? "rounded-lg shadow-sm" : ""}`}
          style={{
            backgroundColor: activeTab === "counselor" ? Colors.darkGreen : "transparent",
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
              className={`font-psemibold ml-2 ${activeTab === "counselor" ? "text-white" : "text-gray-600"}`}
            >
              Counselor
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Signup;