// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import { Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import GlobalProvider from "@/context/GlobalProvider";
// import { ToastProvider } from "@/components/ToastProvider";
// import * as SplashScreen from "expo-splash-screen";
// import React, { useEffect } from "react";
// import "react-native-reanimated";
// import { StatusBar, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AppHeader from "@/components/AppHeader";

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [fontsLoaded, error] = useFonts({
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
//     "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
//     "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
//   });

//   useEffect(() => {
//     if (error) throw error;

//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, error]);

//   if (!fontsLoaded) {
//     return null;
//   }

//   if (!fontsLoaded && !error) {
//     return null;
//   }

//   return (
//     <ToastProvider>
//       <GlobalProvider>
//         <ThemeProvider value={DefaultTheme}>
//           <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//           <Stack>
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen name="create-post" options={{ headerShown: false }} />
//             <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//             <Stack.Screen
//               name="(tabs)"
//               options={{
//                 headerTitle: () => <AppHeader />,
//                 headerShadowVisible: false,
//               }}
//             />
//             <Stack.Screen
//               name="threads/[id]"
//               options={{
//                 headerTitle: "Post",
//                 headerTitleAlign: "center",
//               }}
//             />
//             <Stack.Screen
//               name="search-post/[query]"
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="analytics/index"
//               options={{ headerShown: false }}
//             />
//           </Stack>
//         </ThemeProvider>
//       </GlobalProvider>
//       <Toast />
//     </ToastProvider>
//   );
// }




import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import GlobalProvider from "@/context/GlobalProvider";
import { ToastProvider } from "@/components/ToastProvider";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/DrawerContent";
import Colors from "@/assets/colors/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [fontsLoaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <ToastProvider>
      <GlobalProvider>
        <ThemeProvider value={DefaultTheme}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
              <Drawer
              drawerStyle={{ width: '60%' }}
              open={openMenu}
              onOpen={() => setOpenMenu(true)}
              onClose={() => setOpenMenu(false)}
              renderDrawerContent={() => (
                <DrawerContent
                  onClose={() => setOpenMenu(false)}
                  onLogOut={() => setOpenMenu(false)}
                />
              )}
             >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="create-post"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerLeft: () => (
                    <TouchableOpacity
                      onPressOut={() => {
                        setOpenMenu(true);
                      }}
                    >
                      <Ionicons name="menu" size={24} color={Colors.darkestGreen} />
                    </TouchableOpacity>
                  ),
                  headerTitle: "",
                  headerRight: () => (
                    <TouchableOpacity
                      onPressOut={() => {
                        console.log("notification icon has been pressed");
                      }}
                    >
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={Colors.darkestGreen}
                      />
                    </TouchableOpacity>
                  ),
                  headerTitleAlign: "center",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="threads/[id]"
                options={{
                  headerTitle: "Post",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="search-post/[query]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="analytics/index"
                options={{ headerShown: false }}
              />
            </Stack>
          </Drawer>
        </ThemeProvider>
      </GlobalProvider>
      <Toast />
    </ToastProvider>
  );
}
