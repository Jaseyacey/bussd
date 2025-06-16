import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PercentageOfAllBusRoutes from "../../screens/PercentageOfAllBusRoutes";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Mock navigation hooks
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

// Mock DropDownPicker
jest.mock("react-native-dropdown-picker", () => {
  return function MockDropDownPicker(props: any) {
    return null; // The actual UI isn't important for these tests
  };
});

// Mock the environment variable
process.env.EXPO_PUBLIC_URL = "http://test-api.com";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

// Mock fetch
global.fetch = jest.fn();

describe("PercentageOfAllBusRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        routeId: 1,
        bus_route: "87",
        percentage_travelled: 50,
        userUuid: "123",
      },
    });
  });
  it("renders correctly with initial state", () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <PercentageOfAllBusRoutes />
      </NavigationContainer>
    );
    expect(getByText("Percentage of All Bus Routes")).toBeTruthy();
  });
  it("fetches and displays percentage", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PercentageOfAllBusRoutes />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("Percentage of All Bus Routes")).toBeTruthy();
    });
  });
  it("displays loading state", () => {
    const { getByText } = render(
      <NavigationContainer>
        <PercentageOfAllBusRoutes />
      </NavigationContainer>
    );
    expect(getByText("Loading...")).toBeTruthy();
  });
  it("displays error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );
    const { getByText } = render(
      <NavigationContainer>
        <PercentageOfAllBusRoutes />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("Error fetching percentage")).toBeTruthy();
    });
  });
  it("displays percentage value", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ percentage: 10 }),
    });
    const { getByText } = render(
      <NavigationContainer>
        <PercentageOfAllBusRoutes />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("10%")).toBeTruthy();
    });
  });
});
