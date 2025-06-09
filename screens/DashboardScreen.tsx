import React, { useEffect, useState } from "react";
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
import BottomTab from "../src/components/BottomTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../src/lib/constants/config";

interface RouteData {
  bus_route: string;
  id: number;
  title: string;
  percentage_travelled: number;
}

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    const getUserUuid = async () => {
      const uuid = await AsyncStorage.getItem("user_uuid");
      setUserUuid(uuid);
    };
    getUserUuid();
  }, []);

  useEffect(() => {
    if (!userUuid) return;

    fetch(`${API_URL}/api/dashboard/routes/?user_uuid=${userUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          setRoutes(data.routes);
        } else {
          console.log("No routes found:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching routes:", error);
      });
  }, [userUuid]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text testID="header" style={styles.title}>
          Bus routes taken
        </Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={() => (
            <View testID="noRoutesContainer" style={styles.noRoutesContainer}>
              <Text testID="noRoutesText" style={styles.noRoutesText}>
                Add a route to get started
              </Text>
              <Button
                testID="addRouteButton"
                title="Add route"
                onPress={() => navigation.navigate("AddBusRoute")}
              />
            </View>
          )}
          renderItem={({ item }) => (
            <View testID="listItem" key={item.id} style={styles.listItem}>
              <Text>{item.bus_route}</Text>
              <Text>{item.percentage_travelled} %</Text>
            </View>
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
    height: "100%",
    backgroundColor: "red",
    padding: 20,
  },
  noRoutesText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noRoutesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
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
