import React, { useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../components/Navigation/MainNavigator";
import { API_URL } from "../constants/config";
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope", size: 24 }}
          onChangeText={(text) => setForm({ ...form, email: text })}
          value={form.email}
          errorMessage={errors.email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          disabled={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock", size: 24 }}
          onChangeText={(text) => setForm({ ...form, password: text })}
          value={form.password}
          errorMessage={errors.password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          disabled={loading}
        />
        <Input
          label="Confirm Password"
          leftIcon={{ type: "font-awesome", name: "lock", size: 24 }}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          value={form.confirmPassword}
          errorMessage={errors.confirmPassword}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          disabled={loading}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Already have an account? Sign in here."
          type="clear"
          onPress={() => navigation.navigate("SignInScreen")}
          containerStyle={{ marginVertical: 10 }}
          titleStyle={{ color: "#007bff", textDecorationLine: "underline" }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => {
            signUpWithEmail();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
