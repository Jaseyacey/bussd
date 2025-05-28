import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const handleSplashScreen = () => {};
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Buss'd</Text>
      <Text style={{ fontSize: 18, fontWeight: "normal" }}>
        How many bus routes have you taken?
      </Text>
    </View>
  );
};

export default SplashScreen;
