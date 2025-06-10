import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../components/Navigation/MainNavigator";
import {
  validateEmail,
  validatePassword,
  getPasswordRequirements,
  validateConfirmPassword,
} from "../utils/validation";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Auth() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_URL;
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(form.password)) {
      newErrors.password = getPasswordRequirements();
    }

    if (
      form.confirmPassword &&
      !validateConfirmPassword(form.password, form.confirmPassword)
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signInWithEmail = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/supabase/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const { user } = await response.json();
      navigation.navigate("Dashboard", {
        email: user.email,
        user_uuid: user.id,
      });
    } catch (error) {
      setErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/supabase/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const data = await response.json();
      Alert.alert(
        "Sign up successful",
        "Your account has been created. You can now sign in."
      );
      await signInWithEmail();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to sign up. Please try again.";
      setErrors({
        email: errorMessage,
        password: errorMessage,
        confirmPassword: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <Text style={styles.loadingText} testID="Loading...">
          Loading...
        </Text>
      )}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#666"
          onChangeText={(text) => setForm({ ...form, email: text })}
          value={form.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#666"
          onChangeText={(text) => setForm({ ...form, password: text })}
          value={form.password}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          value={form.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <Text
        style={styles.signIn}
        onPress={() => navigation.navigate("SignInScreen")}
      >
        Already have an account? Sign in
      </Text>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  signIn: {
    color: "#007AFF",
    fontSize: 16,
    width: "100%",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  signUpButton: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginBottom: 20,
    color: "#666",
  },
});
