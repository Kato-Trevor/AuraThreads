import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import GlobalProvider from "@/context/GlobalProvider";
import { ToastProvider } from "@/components/ToastProvider";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/DrawerContent";

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
          {/* <Drawer
            open={openMenu}
            onOpen={() => setOpenMenu(true)}
            onClose={() => setOpenMenu(false)}
            renderDrawerContent={() => (
              <DrawerContent onLogOut={() => setOpenMenu(false)} />
            )}
          > */}
          <Drawer
            drawerStyle={{ width: "60%" }}
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
                      <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                  ),
                  headerTitle: () => (
                    <View className="bg-white rounded-full p-2 shadow-md">
                      <View className="bg-secondary-100 rounded-full p-2">
                        <Ionicons
                          name="leaf-outline"
                          size={24}
                          color="#FFE4E1"
                        />
                      </View>
                    </View>
                  ),
                  headerRight: () => (
                    <TouchableOpacity
                      onPressOut={() => {
                        console.log("notification icon has been pressed");
                      }}
                    >
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  ),
                  headerTitleAlign: "center",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="threads/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="profile/[id]"
                options={{
                  headerTitle: "Profile",
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
              <Stack.Screen
                name="settings/index"
                options={{
                  headerTitle: () => (
                    <Text className="text-lg font-psemibold text-secondary-darkest">
                      Settings
                    </Text>
                  ),
                  headerTitleAlign: "center",
                }}
              />
            </Stack>
          </Drawer>
        </ThemeProvider>
      </GlobalProvider>
      <Toast />
    </ToastProvider>
  );
}
