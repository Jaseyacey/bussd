import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callForgotPassword = () => {
    console.log("Forgot Password");
  };

  const signIn = () => {
    setLoading(true);
    const API_URL = process.env.EXPO_PUBLIC_URL;
    axios
      .post(`${API_URL}/supabase/auth/signin`, {
        email: email,
        password: password,
      })
      .then((response) => {
        setLoading(false);
        navigation.navigate("Dashboard", {
          email: email,
          user_uuid: response.data.user.id,
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {loading && (
        <Text style={styles.loadingText} testID="Loading...">
          Loading...
        </Text>
      )}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
      </View>
      <Text style={styles.signUp} onPress={() => navigation.navigate("Auth")}>
        Sign up
      </Text>
      <Text style={styles.forgotPassword} onPress={callForgotPassword}>
        Forgot Password?
      </Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={signIn}
        testID="Sign In"
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  forgotPassword: {
    color: "red",
    fontSize: 16,
    width: "100%",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  signUp: {
    color: "#007AFF",
    fontSize: 16,
    width: "100%",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  signInButton: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginBottom: 20,
    color: "#666",
  },
});

export default SignInScreen;
