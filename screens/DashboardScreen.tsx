import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  Animated,
} from "react-native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import BottomTab from "../src/components/BottomTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../src/lib/constants/config";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

  const renderItem = ({ item }: { item: RouteData }) => {
    const handleDelete = () => {
      Alert.alert(
        "Delete Route",
        "Are you sure you want to delete this route?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              fetch(`${API_URL}/api/tfl/delete-bus-route/${item.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.message === "Bus route deleted") {
                    setRoutes(routes.filter((route) => route.id !== item.id));
                    Alert.alert("Route deleted", "Route deleted successfully");
                    fetch(
                      `${API_URL}/api/dashboard/routes/?user_uuid=${userUuid}`,
                      {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                  } else {
                    console.error("Error deleting route:", data);
                  }
                })
                .catch((error) => {
                  console.error("Error deleting route:", error);
                });
            },
          },
        ]
      );
    };

    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });

      return (
        <View style={styles.rightActions}>
          <Animated.View
            style={[
              styles.actionButton,
              styles.editButton,
              { transform: [{ scale }] },
            ]}
          >
            <Icon
              name="pencil"
              size={24}
              color="#fff"
              onPress={() =>
                navigation.navigate("EditBusRoute", {
                  routeId: item.id,
                  bus_route: item.bus_route,
                  percentage_travelled: item.percentage_travelled,
                  userUuid: userUuid || "",
                })
              }
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.actionButton,
              styles.deleteButton,
              { transform: [{ scale }] },
            ]}
          >
            <Icon
              testID={`deleteButton-${item.bus_route}`}
              name="trash-can"
              size={24}
              color="#fff"
              onPress={handleDelete}
            />
          </Animated.View>
        </View>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions} rightThreshold={40}>
        <View testID="listItem" style={styles.listItem}>
          <View style={styles.routeInfo}>
            <View style={styles.routeNumberBox}>
              <Text style={styles.routeNumber}>{item.bus_route}</Text>
            </View>
          </View>
          <Text style={styles.percentage}>{item.percentage_travelled}%</Text>
        </View>
      </Swipeable>
    );
  };

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
          testID="listItem"
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
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
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
  percentage: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
    marginLeft: 8,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 120,
  },
  actionButton: {
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "red",
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
