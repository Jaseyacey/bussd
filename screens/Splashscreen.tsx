import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  SignUpScreen: undefined;
  BrokenScreen: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const API_URL = process.env.EXPO_PUBLIC_URL;
        console.log("API URL:", API_URL);

        if (!API_URL) {
          console.error("API_URL is not defined in environment variables");
          setIsLoggedIn(false);
          navigation.navigate("BrokenScreen");
          return;
        }

        const response = await fetch(`${API_URL}/auth/session`);
        if (!response.ok) {
          throw new Error("Failed to fetch login status");
        }
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);

        if (!data.isLoggedIn) {
          navigation.navigate("SignUpScreen");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        navigation.navigate("SignUpScreen");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Buss'd</Text>
      <Text style={{ fontSize: 18, fontWeight: "normal" }}>
        How many bus routes have you taken?
      </Text>
      {isLoggedIn === null && (
        <Text style={{ marginTop: 20 }}>Checking login status...</Text>
      )}
    </View>
  );
};

export default SplashScreen;
