import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { API_URL } from "../src/lib/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { StackNavigationProp } from "@react-navigation/stack";

type EditBusRouteRouteProp = RouteProp<RootStackParamList, "EditBusRoute">;
type EditBusRouteNavigationProp = StackNavigationProp<RootStackParamList>;

const EditBusRoute = () => {
  const navigation = useNavigation<EditBusRouteNavigationProp>();
  const route = useRoute<EditBusRouteRouteProp>();
  const { routeId, bus_route, percentage_travelled, userUuid } = route.params;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [routeNumber, setRouteNumber] = useState(bus_route);
  const [percentage, setPercentage] = useState<number>(
    percentage_travelled || 0
  );
  const [routeData, setRouteData] = useState<any>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Dropdown states
  const [stops, setStops] = useState<{ label: string; value: string }[]>([]);
  const [stop1, setStop1] = useState<string | null>(null);
  const [stop2, setStop2] = useState<string | null>(null);
  const [openFirstStop, setOpenFirstStop] = useState(false);
  const [openSecondStop, setOpenSecondStop] = useState(false);

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        setUserEmail(email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };
    getUserEmail();
  }, []);

  const fetchStops = useCallback(async () => {
    if (!routeNumber) {
      return Alert.alert("Input Required", "Please enter a route number");
    }
    try {
      const response = await fetch(
        `${API_URL}/api/tfl/stops?route_id=${routeNumber}&direction=outbound`
      );
      const data = await response.json();

      if (!response.ok || data.error) {
        return Alert.alert("Error", data.error || "Unable to fetch stops");
      }

      const stopItems = data.stops.map((stop: any) => ({
        label: stop.name || stop.id,
        value: stop.id,
      }));

      if (stopItems.length === 0) {
        return Alert.alert("No Stops Found", "Try a different route");
      }

      setStops(stopItems);

      // Only set default stops if they haven't been set yet
      if (!stop1 || !stop2) {
        if (routeData?.data?.[0]) {
          const currentStartStop = routeData.data[0].started_stop;
          const currentEndStop = routeData.data[0].ended_stop;
          setStop1(currentStartStop);
          setStop2(currentEndStop);
        } else {
          setStop1(stopItems[0].value);
          setStop2(stopItems[stopItems.length - 1].value);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while fetching stops");
    }
  }, [routeNumber, stop1, stop2]);

  const handleUpdateRoute = useCallback(async () => {
    console.log("Updating route with details:", { routeNumber, stop1, stop2 });
    if (!routeNumber || !stop1 || !stop2) {
      return Alert.alert("Missing Info", "Please complete all fields");
    }

    try {
      // First get the number of stops between
      const numberOfStopsBetween = await fetch(
        `${API_URL}/api/tfl/stops-between?route_id=${routeNumber}&from_stop_id=${stop1}&to_stop_id=${stop2}`
      );
      const numberOfStopsBetweenData = await numberOfStopsBetween.json();

      if (!numberOfStopsBetween.ok || numberOfStopsBetweenData.error) {
        return Alert.alert(
          "Error",
          numberOfStopsBetweenData.error || "Failed to find stops between"
        );
      }

      const { all_stop_ids = [], count = 0 } = numberOfStopsBetweenData;
      const newPercentage = Math.round((count / all_stop_ids.length) * 100);

      const payload = {
        user_email: userEmail,
        bus_route: routeNumber,
        percentage_travelled: String(newPercentage),
        started_stop: stop1,
        ended_stop: stop2,
        user_uuid: userUuid,
      };

      console.log("Sending update payload:", payload);

      // Update the route
      const updateRes = await fetch(
        `${API_URL}/api/tfl/update-bus-route/${routeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const updateData = await updateRes.json();
      if (!updateRes.ok || updateData.error) {
        console.error("Update failed:", updateData);
        return Alert.alert(
          "Error",
          updateData.error || "Failed to update route"
        );
      }

      if (!updateData.data || updateData.data.length === 0) {
        console.error("No data in update response");
        return Alert.alert("Error", "No route was updated. Please try again.");
      }

      Alert.alert("Success", "Route updated successfully", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("Dashboard", {
              email: userEmail || "",
              user_uuid: userUuid || "",
            }),
        },
      ]);
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Something went wrong while updating the route");
    }
  }, [routeNumber, stop1, stop2, routeId, userEmail, userUuid, navigation]);

  // Initial data fetch
  useEffect(() => {
    if (!userEmail || initialDataLoaded) return;

    const fetchRouteData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/tfl/update-bus-route/${routeId}?user_email=${userEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setRouteData(data);
        setInitialDataLoaded(true);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRouteData();
  }, [routeId, userEmail, initialDataLoaded]);

  // Fetch stops after initial data is loaded
  useEffect(() => {
    if (initialDataLoaded && routeData) {
      fetchStops();
    }
  }, [initialDataLoaded, fetchStops]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Bus Route</Text>
        <Text style={styles.subtitle}>Update your start and end stops</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter single bus route number (e.g. 87)"
            value={routeNumber}
            onChangeText={(text) => setRouteNumber(text.trim())}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={fetchStops}>
            <Text style={styles.buttonText}>Fetch Stops</Text>
          </TouchableOpacity>

          <DropDownPicker
            open={openFirstStop}
            value={stop1}
            items={stops}
            setOpen={setOpenFirstStop}
            setValue={setStop1}
            setItems={setStops}
            placeholder="Select Start Stop"
            listMode="SCROLLVIEW"
            maxHeight={300}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            zIndex={3000}
            zIndexInverse={1000}
          />

          <DropDownPicker
            open={openSecondStop}
            value={stop2}
            items={stops}
            setOpen={setOpenSecondStop}
            setValue={setStop2}
            setItems={setStops}
            placeholder="Select End Stop"
            listMode="SCROLLVIEW"
            maxHeight={300}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdateRoute}
        >
          <Text style={styles.buttonText}>Update Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#f5f5f5",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  dropdownPlaceholder: {
    color: "#666",
    fontSize: 16,
  },
});

export default EditBusRoute;
