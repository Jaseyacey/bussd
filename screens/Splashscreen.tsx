import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

import { RootStackParamList } from "../components/Navigation/MainNavigator";
import {
  initAmplitude,
  setAmplitudeUserId,
  trackEvent,
} from "../src/lib/utils/amplitude";

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleTrackingConsent = async (email: string) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || "";

      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("GRANTED: Tracking permission granted.");
      } else {
        console.log("Tracking not granted.");
      }

      console.log("Initializing Amplitude...");
      await initAmplitude(apiKey);
      setAmplitudeUserId(email);
      console.log("Amplitude initialized and user ID set.");
    } catch (err) {
      console.error("Error during Amplitude setup:", err);
      navigation.navigate("Auth");
    }
  };

  useEffect(() => {
    trackEvent("splash_screen_loaded");

    const checkLoginStatus = async () => {
      try {
        const API_URL = process.env.EXPO_PUBLIC_URL;
        if (!API_URL) {
          throw new Error("API_URL is not defined in environment variables");
        }

        const response = await fetch(`${API_URL}/auth/session`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch login status: ${response.statusText}`
          );
        }

        const data = await response.json();
        const { session } = data;

        if (session?.user?.email && session.user.id) {
          await AsyncStorage.setItem("user_uuid", session.user.id);
          await AsyncStorage.setItem("userEmail", session.user.email);
          await handleTrackingConsent(session.user.email);
          console.log("TRACKING CONSENT COMPLETED", data);

          navigation.navigate("Dashboard", {
            email: session.user.email,
            user_uuid: session.user.id,
          });
        } else {
          console.log("Session or user data missing, navigating to Auth.");
          navigation.navigate("Auth");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigation.navigate("Auth");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buss'd</Text>
      <Text style={styles.subtitle}>How many bus routes have you taken?</Text>
      <Text style={styles.loading}>Checking login status...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
    color: "#666",
  },
});

export default SplashScreen;
