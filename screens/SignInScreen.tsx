import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
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
      {loading && <Text testID="Loading...">Loading...</Text>}
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Sign In" onPress={() => signIn()} testID="Sign In" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SignInScreen;
