import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddBusRoute = ({ navigation }: { navigation: any }) => {
  const [routeId, setRouteId] = useState("");

  const [stops, setStops] = useState<{ label: string; value: string }[]>([]);
  const [stop1, setStop1] = useState<string | null>(null);
  const [stop2, setStop2] = useState<string | null>(null);

  const [openFirstStop, setOpenFirstStop] = useState(false);
  const [openSecondStop, setOpenSecondStop] = useState(false);

  const fetchStops = useCallback(async () => {
    if (!routeId)
      return Alert.alert("Input Required", "Please enter a route number");
    const API_URL = process.env.EXPO_PUBLIC_URL;
    try {
      const response = await fetch(
        `${API_URL}/api/tfl/stops?route_id=${routeId}&direction=outbound`
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
      setStop1(stopItems[0].value);
      setStop2(stopItems[stopItems.length - 1].value);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while fetching stops");
    }
  }, [routeId]);

  const handleAddRoute = useCallback(async () => {
    if (!routeId || !stop1 || !stop2) {
      return Alert.alert("Missing Info", "Please complete all fields");
    }

    try {
      const userUuid = await AsyncStorage.getItem("user_uuid");
      const API_URL = process.env.EXPO_PUBLIC_URL;
      const numberOfStopsBetween = await fetch(
        `${API_URL}/api/tfl/stops-between?route_id=${routeId}&from_stop_id=${stop1}&to_stop_id=${stop2}`
      );
      const numberOfStopsBetweenData = await numberOfStopsBetween.json();

      if (!numberOfStopsBetween.ok || numberOfStopsBetweenData.error) {
        return Alert.alert(
          "Error",
          numberOfStopsBetweenData.error || "Failed to find stops between"
        );
      }

      const { all_stop_ids = [], count = 0 } = numberOfStopsBetweenData;
      const percentage = Math.round((count / all_stop_ids.length) * 100);

      const addRes = await fetch(
        `${API_URL}/api/tfl/add-bus-route?bus_route=${routeId}&percentage=${percentage}&user_uuid=${userUuid}&started_stop=${stop1}&ended_stop=${stop2}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const addData = await addRes.json();
      if (!addRes.ok || addData.error) {
        return Alert.alert("Error", addData.error || "Failed to add route");
      }

      navigation.navigate("Dashboard");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while adding the route");
    }
  }, [routeId, stop1, stop2, navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Bus Route</Text>
        <Text style={styles.subtitle}>Select your start and end stops</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter single bus route number (e.g. 87)"
            value={routeId}
            onChangeText={(text) => setRouteId(text.trim())}
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

        <TouchableOpacity style={styles.submitButton} onPress={handleAddRoute}>
          <Text style={styles.buttonText}>Add Route</Text>
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

export default AddBusRoute;
