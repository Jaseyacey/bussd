import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const signOut = async () => {
    fetch(`${process.env.EXPO_PUBLIC_URL}/supabase/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const route = useRoute<RouteProp<RootStackParamList, "Dashboard">>();
  const { email } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {email}!</Text>
      <Text style={styles.text}>
        You've successfully signed up and logged in.
      </Text>
      <Button
        title="Sign out"
        onPress={() => {
          signOut();
        }}
      />
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
  text: {
    fontSize: 16,
    color: "#666",
  },
});

export default DashboardScreen;
