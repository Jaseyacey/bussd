import React from "react";
import { View, Text } from "react-native";

const BrokenScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        This screen is broken
      </Text>
      <Text style={{ fontSize: 16, color: "#666" }}>
        Please check the code or report this issue.
      </Text>
    </View>
  );
};
export default BrokenScreen;
