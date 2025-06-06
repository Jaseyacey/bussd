import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const signIn = () => {
    const API_URL = process.env.EXPO_PUBLIC_URL;
    axios
      .post(`${API_URL}/supabase/auth/signin`, {
        email: email,
        password: password,
      })
      .then((response) => {
        navigation.navigate("Dashboard", {
          email: email,
          user_uuid: response.data.user.id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
      <Input
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Sign In" onPress={() => signIn()} />
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
