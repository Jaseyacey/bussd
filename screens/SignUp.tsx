import axios from "axios";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const SignUp = () => {
  const [email, setEmail] = React.useState("jbeedle@gmail.com");
  const [password, setPassword] = React.useState("Padres756");
  const [confirmPassword, setConfirmPassword] = React.useState("Padres756");
  const [error, setError] = React.useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("Signing up with:", { email, password });
    axios
      .post(`${process.env.EXPO_PUBLIC_URL}/supabase/auth/signup`, {
        email,
        password,
      })
      .then((response) => {
        console.log("Sign up successful:", response.data);
      })
      .catch((error) => {
        console.error(
          "Sign up error:",
          `${process.env.EXPO_PUBLIC_URL}/supabase/auth/signup`,
          error
        );
        console.error("Sign up error:", error);
        setError("Sign up failed. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create a new account</Text>
      <Text style={{ marginTop: 20 }}>
        Please fill in the details above to sign up.
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "85%",
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "85%",
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "85%",
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      />
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}
      <Text
        onPress={handleSignUp}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: 10,
          textAlign: "center",
          width: "85%",
          borderRadius: 5,
        }}
      >
        Sign Up
      </Text>
      <Text style={{ marginTop: 20, color: "blue" }}>
        Already have an account? Log in
      </Text>
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
    fontSize: 16,
    color: "#666",
  },
});

export default SignUp;
