import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  FlatList,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ListItem } from "@rneui/base";
import BottomTab from "../src/components/BottomTab";

interface StopPoint {
  name: string;
  id: string;
  lat: number;
  lon: number;
  stopLetter?: string;
  towards?: string;
}

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus routes taken</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={[
            { id: 1, title: "Route 1", percentageTaken: 1 },
            { id: 2, title: "Route 2", percentageTaken: 100 },
            { id: 3, title: "Route 3", percentageTaken: 50 },
            { id: 4, title: "Route 4", percentageTaken: 100 },
            { id: 5, title: "Route 5", percentageTaken: 23 },
            { id: 6, title: "Route 6", percentageTaken: 100 },
            { id: 7, title: "Route 7", percentageTaken: 100 },
            { id: 8, title: "Route 8", percentageTaken: 100 },
            { id: 9, title: "Route 9", percentageTaken: 100 },
          ]}
          style={styles.list}
          renderItem={({ item }) => (
            <ListItem key={item.id} onPress={() => {}}>
              <ListItem.Content style={styles.listItem}>
                <ListItem.Title>{item.title}</ListItem.Title>
                <ListItem.Subtitle>{item.percentageTaken}%</ListItem.Subtitle>
                <ListItem.Chevron />
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
      <View style={styles.footer}>
        <BottomTab />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 20,
  },
  list: {
    width: "100%",
    backgroundColor: "green",
    padding: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "blue",
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
  footer: {
    width: "100%",
    backgroundColor: "yellow",
    padding: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
