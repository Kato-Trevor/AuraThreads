import { View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

const ButtonLoadingAnimation = () => {
  const scaleBall1 = useRef(new Animated.Value(1)).current;
  const scaleBall2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleBall1, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBall2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleBall1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBall2, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scaleBall1, scaleBall2]);

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "center" }}
      className="mb-5"
    >
      <Animated.View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "#F032DA",
          borderRadius: 10,
          transform: [{ scale: scaleBall1 }],
          marginHorizontal: 5,
        }}
      />
      <Animated.View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "#B620A7",
          borderRadius: 10,
          transform: [{ scale: scaleBall2 }],
          marginHorizontal: 5,
        }}
      />
    </View>
  );
};

export default ButtonLoadingAnimation;
