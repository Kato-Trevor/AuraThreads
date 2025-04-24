// import React from "react";
// import { View, Text, TouchableOpacity, Switch } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { signOut } from "@/lib/appwrite/auth";
// import { router } from "expo-router";
// import { useGlobalContext } from "@/context/GlobalProvider";

// const DrawerContent = ({ onLogOut }: { onLogOut: () => void }) => {
//   const { user, enableAnonymousID, setEnableAnonymousID } = useGlobalContext();
//   const { showToast } = useToast();

//   const handleLogOut = async () => {
//     onLogOut();
//     await signOut();
//     router.replace("/sign-in");
//   };

//   return (
//     <View className="flex-1 bg-white pt-20">
//       {(user && user.role === "student") && (
//         <View className="flex-row items-center justify-between p-3">
//           <View className="flex-row items-center">
//             <MaterialCommunityIcons
//               name="account-eye-outline"
//               size={24}
//               color={enableAnonymousID ? "#F032DA" : "#666"}
//             />
//             <Text
//               className={"ml-2 mr-2 font-medium text-gray-700"}
//             >
//               Use anonymous username
//             </Text>
//             <TouchableOpacity
//               onPress={() =>
//                 showToast("All engagements will be anonymous", "info")
//               }
//             >
//               <Ionicons
//                 name="information-circle-outline"
//                 size={20}
//                 color="#666"
//               />
//             </TouchableOpacity>
//           </View>
//           <Switch
//             value={enableAnonymousID}
//             onValueChange={() => setEnableAnonymousID(!enableAnonymousID)}
//             trackColor={{ false: "#ccc", true: "#F032DA" }}
//             thumbColor={enableAnonymousID ? "#fff" : "#f4f3f4"}
//             style={{
//               transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
//             }}
//           />
//         </View>
//       )}
//       <TouchableOpacity
//         className="flex-row items-center p-4 border-t border-gray-200"
//         onPress={() => handleLogOut()}
//       >
//         <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
//         <Text className="font-['Poppins-Medium'] text-base text-red-500 ml-4">
//           Logout
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default DrawerContent;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@/lib/appwrite/auth";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

type DrawerContentProps = {
  onClose: () => void;
  onLogOut: () => void;
};

const DrawerContent = ({ onClose, onLogOut }: DrawerContentProps) => {

  const handleLogOut = async () => {
    onLogOut();
    await signOut();
    router.replace("/sign-in");
  };

  type DrawerItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
  };

  // Anonymous stuff
  const { user } = useGlobalContext();

  const DrawerItem = ({
    icon,
    label,
    onPress,
    color = "#000",
  }: DrawerItemProps) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4">
      <Ionicons name={icon} size={24} color={color} />
      <Text
        className="font-['Poppins-Medium'] text-base ml-4"
        style={{ color }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white pt-20 px-6">
      {/* Centered leaf icon with proper spacing */}
      {/* <View className="items-center mb-5">
        <View className="bg-white rounded-full p-2 shadow-md">
          <View
            style={{ backgroundColor: "#18392b" }}
            className="rounded-full p-3 w-12 h-12 items-center justify-center"
          >
            <Ionicons name="leaf-outline" size={24} color="#ffffff" />
          </View>
        </View>
      </View> */}

      {/* <View className="border-t" style={{ borderColor: "#d0ded8" }} /> */}
      <View>
        <DrawerItem
          icon="person-outline"
          label="Profile"
          onPress={() => {
            onClose();
            router.push(`/profile/${user.$id}`);
          }}
          color="#18392b"
        />
        {/* <DrawerItem
          icon="cloud-outline"
          label="Bookmarks"
          onPress={() => {
            onClose();
            router.push("/Bookmarks");
          }}
          color="#18392b"
        /> */}
        <DrawerItem
          icon="book-outline"
          label="Journal"
          onPress={() => {
            onClose();
            router.push("/journal");
          }}
          color="#18392b"
        />
        <DrawerItem
          icon="bookmark-outline"
          label="Bookmarks"
          onPress={() => {
            onClose();
            router.push("/bookmarks");
          }}
          color="#18392b"
        />

        {/* Divider below Bookmarks
        <View className="border-t" style={{ borderColor: "#d0ded8" }} /> */}
        {/* Settings Drawer Item */}
        <DrawerItem
          icon="settings-outline"
          label="Settings"
          onPress={() => {
            onClose();
            router.push("/settings");
          }}
          color="#18392b"
        />
      </View>


      {/* Spacer */}
      <View className="flex-1" />

      <View className="border-t" style={{ borderColor: "#d0ded8" }} />
      {/* Logout at the bottom */}
      <DrawerItem
        icon="log-out-outline"
        label="Logout"
        onPress={handleLogOut}
        color="#18392b"
      />
    </View>
  );
};

export default DrawerContent;
