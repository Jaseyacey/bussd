import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { API_URL } from "src/lib/constants/config";

const PercentageOfAllBusRoutes = () => {
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uuid = await AsyncStorage.getItem("user_uuid");
        if (!uuid) return;

        const [userRoutesRes, tflRoutesRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/routes/?user_uuid=${uuid}`, {
            headers: { "Content-Type": "application/json" },
          }),
          fetch("https://api.tfl.gov.uk/Line/Mode/bus"),
        ]);

        const userData = await userRoutesRes.json();
        const tflData = await tflRoutesRes.json();

        const userRouteCount = userData.routes?.length ?? 0;
        const tflRouteCount = tflData?.length ?? 1;

        const calculatedPercentage = (userRouteCount / tflRouteCount) * 100;
        setPercentage(calculatedPercentage);
      } catch (error) {
        console.error("Error calculating route percentage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Percentage of All Bus Routes</Text>
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>
          Percentage of all TfL bus routes taken:
          <Text style={styles.percentageValue}>
            {loading ? "Loading..." : `${percentage.toFixed(1)}%`}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    paddingTop: 40,
  },
  percentageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  percentageValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginLeft: 8,
  },
});

export default PercentageOfAllBusRoutes;
