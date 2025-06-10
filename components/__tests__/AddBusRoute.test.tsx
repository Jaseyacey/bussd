import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddBusRoute from "../../screens/AddBusRoute";

// Mock DropDownPicker
jest.mock("react-native-dropdown-picker", () => {
  return function MockDropDownPicker(props: any) {
    return null;
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

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe("AddBusRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    expect(getByText("Add Bus Route")).toBeTruthy();
    expect(getByText("Select your start and end stops")).toBeTruthy();
    expect(
      getByPlaceholderText("Enter single bus route number (e.g. 87)")
    ).toBeTruthy();
    expect(getByText("Fetch Stops")).toBeTruthy();
    expect(getByText("Add Route")).toBeTruthy();
  });

  it("shows alert when fetching stops without route ID", async () => {
    const { getByText } = render(<AddBusRoute navigation={mockNavigation} />);

    await act(async () => {
      fireEvent.press(getByText("Fetch Stops"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Input Required",
      "Please enter a route number"
    );
  });

  it("successfully fetches stops", async () => {
    const mockStops = {
      stops: [
        { id: "stop1", name: "Stop 1" },
        { id: "stop2", name: "Stop 2" },
      ],
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStops),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Fetch Stops"));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api.com/api/tfl/stops?route_id=87&direction=outbound"
    );
  });

  it("handles fetch stops error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to fetch stops" }),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Fetch Stops"));
    });

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to fetch stops");
  });

  it("handles fetch stops network error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Fetch Stops"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Something went wrong while fetching stops"
    );
  });

  it("shows alert when no stops are found", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ stops: [] }),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Fetch Stops"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "No Stops Found",
      "Try a different route"
    );
  });

  it("shows alert when adding route without required fields", async () => {
    const { getByText } = render(<AddBusRoute navigation={mockNavigation} />);

    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Missing Info",
      "Please complete all fields"
    );
  });

  it("successfully adds a route", async () => {
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    // Mock successful stops-between fetch
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              all_stop_ids: ["stop1", "stop2", "stop3"],
              count: 2,
            }),
        })
      )
      // Mock successful add-bus-route fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

    const { getByText, getByPlaceholderText, rerender } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    // Set up the component with necessary state
    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    // Simulate successful stops fetch to set up the state
    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Dashboard");
    }, 1000);
  });

  it("handles error when getting stops between", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to find stops between" }),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to find stops between"
      );
    }, 1000);
  });

  it("handles error when adding route", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    // Mock successful stops-between fetch but failed add-route fetch
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              all_stop_ids: ["stop1", "stop2", "stop3"],
              count: 2,
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Failed to add route" }),
        })
      );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to add route");
    }, 1000);
  });

  it("handles network error when adding route", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "87"
    );

    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Something went wrong while adding the route"
      );
    }, 1000);
  });
});
