import "react-native-url-polyfill/auto";
import React, { useEffect } from "react";
import MainNavigator from "./components/Navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initAmplitude } from "./src/lib/utils/amplitude";

export default function App() {
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || "";
    try {
      initAmplitude(apiKey);
    } catch (error) {
      console.error("Error initializing Amplitude:", error);
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
