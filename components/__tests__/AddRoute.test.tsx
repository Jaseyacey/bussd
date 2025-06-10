import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddBusRoute from "../../screens/AddBusRoute";

// Mock the environment variable
process.env.EXPO_PUBLIC_URL = "http://test-api.com";

// Mock the entire DropDownPicker module
jest.mock("react-native-dropdown-picker", () => {
  return jest.fn(({ items, value, setValue, placeholder }) => {
    return (
      <select
        data-testid={placeholder}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">Select...</option>
        {items.map((item: any) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  });
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

// Mock fetch
global.fetch = jest.fn();

describe("AddBusRoute", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    (Alert.alert as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it("renders correctly", () => {
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

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStops),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
    });

    setTimeout(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://test-api.com/api/tfl/stops?route_id=87&direction=outbound"
      );
    }, 1000);
  });

  it("handles fetch stops error", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "API Error" }),
      })
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "API Error");
    }, 1000);
  });

  it("handles fetch stops network error", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Something went wrong while fetching stops"
      );
    }, 1000);
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

    // Mock successful stops fetch
    (fetch as jest.Mock)
      // First fetch for stops
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              stops: [
                { id: "stop1", name: "Stop 1" },
                { id: "stop2", name: "Stop 2" },
              ],
            }),
        })
      )
      // Second fetch for stops between
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              all_stop_ids: ["stop1", "middle", "stop2"],
              count: 1,
            }),
        })
      )
      // Third fetch for adding route
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    // Enter route number and fetch stops
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
    });

    // Add route
    await act(async () => {
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Dashboard");
    }, 1000);
  });

  it("handles error when getting stops between", async () => {
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    // Mock successful stops fetch but failed stops-between
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              stops: [
                { id: "stop1", name: "Stop 1" },
                { id: "stop2", name: "Stop 2" },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Failed to get stops between" }),
        })
      );

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to get stops between"
      );
    }, 1000);
  });

  it("handles error when adding route", async () => {
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    // Mock successful stops fetch and stops-between but failed add route
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              stops: [
                { id: "stop1", name: "Stop 1" },
                { id: "stop2", name: "Stop 2" },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              all_stop_ids: ["stop1", "middle", "stop2"],
              count: 1,
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

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
      fireEvent.press(getByText("Add Route"));
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to add route");
    }, 1000);
  });

  it("handles network error when adding route", async () => {
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-uuid");

    // Mock successful stops fetch but network error on add route
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              stops: [
                { id: "stop1", name: "Stop 1" },
                { id: "stop2", name: "Stop 2" },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              all_stop_ids: ["stop1", "middle", "stop2"],
              count: 1,
            }),
        })
      )
      .mockImplementationOnce(() => Promise.reject(new Error("Network error")));

    const { getByText, getByPlaceholderText } = render(
      <AddBusRoute navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter single bus route number (e.g. 87)"),
        "87"
      );
      fireEvent.press(getByText("Fetch Stops"));
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
