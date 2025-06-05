import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
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
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn && data.session?.user?.email) {
          navigation.navigate("Dashboard", {
            email: data.session.user.email,
          });
        } else {
          navigation.navigate("Auth");
        }
      } catch (error) {
        console.error(
          "Error checking login status:",
          error instanceof Error ? error.message : String(error)
        );
        setIsLoggedIn(false);
        navigation.navigate("Auth");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buss'd</Text>
      <Text style={styles.subtitle}>How many bus routes have you taken?</Text>
      {isLoggedIn === null && (
        <Text style={styles.loading}>Checking login status...</Text>
      )}
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
