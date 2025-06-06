import React from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
});
