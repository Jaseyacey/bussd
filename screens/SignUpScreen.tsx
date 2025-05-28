import axios from "axios";
import React from "react";
import { Text, StyleSheet, Button } from "react-native";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator.tsx";

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/supabase/auth/signup`,
        {
          email,
          password,
        }
      );
      handleSignIn(response.data.user.email, response.data.user.password);
    } catch (error) {
      console.error("Sign up error:", error);
      setError("Sign up failed. Please try again.");
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    console.log("Attempting to sign in with", email, password);
    if (!email || !password) {
      setError("Email and password are required for sign in.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/supabase/auth/signin`,
        {
          email,
          password,
        }
      );
      navigation.navigate("Dashboard", {
        email: response.data.user.email,
        password: response.data.user.password,
      });
    } catch (error) {
      console.log("Sign in error:", email, password);
      console.error("Sign in error:", error);
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignUpScreen;
