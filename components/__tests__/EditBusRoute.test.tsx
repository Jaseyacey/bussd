import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditBusRoute from "../../screens/EditBusRoute";
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

describe("EditBusRoute", () => {
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
        <EditBusRoute />
      </NavigationContainer>
    );

    expect(getByText("Edit Bus Route")).toBeTruthy();
    expect(getByText("Update your start and end stops")).toBeTruthy();
    expect(
      getByPlaceholderText("Enter single bus route number (e.g. 87)")
    ).toBeTruthy();
    expect(getByText("Fetch Stops")).toBeTruthy();
    expect(getByText("Update Route")).toBeTruthy();
  });
  it("navigates to the dashboard screen after success alert", async () => {
    const mockNavigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        routeId: 1,
        bus_route: "87",
        percentage_travelled: 50,
        userUuid: "123",
      },
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test@test.com");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ all_stop_ids: [1, 2, 3, 4], count: 2 }),
      }) // stops-between
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{}] }),
      }); // update route

    const { getByText } = render(
      <NavigationContainer>
        <EditBusRoute />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText("Update Route"));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });

    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertArgs?.[2] ?? [];
    const okButton = buttons.find((btn: any) => btn.text === "OK");
    okButton?.onPress();

    setTimeout(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Dashboard", {
        email: "test@test.com",
        user_uuid: "123",
      });
    }, 500);
  });
});
