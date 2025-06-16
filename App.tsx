import "react-native-url-polyfill/auto";
import React, { useEffect } from "react";
import MainNavigator from "./components/Navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initAmplitude } from "./src/lib/utils/amplitude";

export default function App() {
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || "";
    if (apiKey) {
      try {
        initAmplitude(apiKey);
      } catch (error) {
        console.error("Error initializing Amplitude:", error);
      }
    } else {
      console.warn("Amplitude API key is missing or invalid. Analytics will not be initialized.");
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
