import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import DashboardScreen from "../../screens/DashboardScreen";
import { NavigationContainer } from "@react-navigation/native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../components/Navigation/MainNavigator";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    Swipeable: View,
    GestureHandlerRootView: View,
  };
});

global.fetch = jest.fn();

describe("DashboardScreen", () => {
  let mockNavigation: Partial<NavigationProp<RootStackParamList>>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigation = {
      navigate: jest.fn(),
    };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue({
      params: { email: "test@test.com", user_uuid: "123" },
    });

    (global.fetch as jest.Mock).mockReset();
  });

  it("renders initial loading state correctly", () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ routes: [] }),
      })
    );

    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );
    expect(getByTestId("header")).toBeTruthy();
  });

  it("shows the routes", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            routes: [
              {
                id: 1,
                bus_route: "123",
                title: "Route 1",
                started_stop: "A",
                ended_stop: "B",
                percentage_travelled: 80,
              },
            ],
          }),
      })
    );

    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByTestId("listItem")).toBeTruthy();
    });
  });

  it("shows the no routes message", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ routes: [] }),
      })
    );
    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByTestId("noRoutesContainer")).toBeTruthy();
    });
  });

  it("shows the add route button", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ routes: [] }),
      })
    );
    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByTestId("addRouteButton")).toBeTruthy();
    });
  });

  it("navigates to the add route screen", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );
    fireEvent.press(getByTestId("addRouteButton"));
    setTimeout(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("AddRoute");
    }, 500);
  });

  it("deletes a route after confirmation", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            routes: [
              {
                id: 1,
                bus_route: "123",
                title: "Route 1",
                started_stop: "A",
                ended_stop: "B",
                percentage_travelled: 80,
              },
            ],
          }),
      })
    );

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: "Bus route deleted" }),
      })
    );

    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation((_, __, buttons) => {
        const deleteBtn = buttons?.find((b) => b.text === "Delete");
        deleteBtn?.onPress?.();
      });

    const { getByTestId } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );

    setTimeout(() => {
      expect(getByTestId("listItem")).toBeTruthy();
      fireEvent.press(getByTestId("deleteButton-123"));
      expect(alertSpy).toHaveBeenCalled();
    }, 500);
  });
});
