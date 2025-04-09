import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef } from "react";
import { Modal, Animated, Easing, Text, View } from "react-native";

const LoadingSpinner = ({ visible }: { visible: boolean }) => {
  const scaleBall1 = useRef(new Animated.Value(1)).current;
  const scaleBall2 = useRef(new Animated.Value(0.5)).current;
  const translateXBall1 = useRef(new Animated.Value(0)).current;
  const translateXBall2 = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleBall1, {
            toValue: 0.5,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBall2, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(translateXBall1, {
            toValue: 30,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateXBall2, {
            toValue: -30,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(scaleBall1, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBall2, {
            toValue: 0.5,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(translateXBall1, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateXBall2, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };

  useEffect(() => {
    if (visible) {
      scaleBall1.setValue(1);
      scaleBall2.setValue(0.5);
      translateXBall1.setValue(0);
      translateXBall2.setValue(0);
      startAnimation();
    }
  }, [visible, scaleBall1, scaleBall2, translateXBall1, translateXBall2]);

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          flexDirection: "column",
        }}
      >
        <View className="flex-row">
          <Animated.View
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#588b76",
              borderRadius: 15,
              transform: [
                { scale: scaleBall1 },
                { translateX: translateXBall1 },
              ],
              shadowColor: "#295f48",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
              marginHorizontal: 5,
            }}
          />

          <Animated.View
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#588b76",
              borderRadius: 15,
              transform: [
                { scale: scaleBall2 },
                { translateX: translateXBall2 },
              ],
              shadowColor: "#295f48",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
              marginHorizontal: 5,
            }}
          />
        </View>

        <Text className="text-white text-lg font-psemibold mt-1">
          Loading...
        </Text>
      </SafeAreaView>
    </Modal>
  );
};

export default LoadingSpinner;
