import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  FlatList,
  StatusBar,
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
  started_stop: string;
  ended_stop: string;
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

  const renderItem = ({ item }: { item: RouteData }) => (
    <View testID="listItem" key={item.id} style={styles.listItem}>
      <View style={styles.routeInfo}>
        <View style={styles.routeNumberBox}>
          <Text style={styles.routeNumber}>{item.bus_route}</Text>
        </View>
      </View>
      <Text style={styles.percentage}>{item.percentage_travelled}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
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
                color="#007AFF"
              />
            </View>
          )}
          renderItem={renderItem}
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000000",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  list: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  routeNumberBox: {
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    width: 70,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeNumber: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
  },
  destination: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  percentage: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
  },
  noRoutesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noRoutesText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "500",
    marginBottom: 16,
    opacity: 0.9,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default DashboardScreen;
