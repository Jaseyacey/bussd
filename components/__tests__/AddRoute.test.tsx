import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import AddBusRoute from "../../screens/AddBusRoute";
import { NavigationContainer } from "@react-navigation/native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../components/Navigation/MainNavigator";

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

global.fetch = jest.fn();

describe("AddBusRoute", () => {
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
  it("should render correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddBusRoute navigation={{ navigate: jest.fn() }} />
      </NavigationContainer>
    );
    expect(
      getByPlaceholderText("Enter single bus route number (e.g. 87)")
    ).toBeTruthy();
    expect(getByText("Fetch Stops")).toBeTruthy();
    expect(getByText("Add Route")).toBeTruthy();
  });
  it("should fetch stops", () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddBusRoute navigation={{ navigate: jest.fn() }} />
      </NavigationContainer>
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "88"
    );
    fireEvent.press(getByText("Fetch Stops"));
    expect(getByText("Select Start Stop")).toBeTruthy();
    expect(getByText("Select End Stop")).toBeTruthy();
  });
  it("should add a route", async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddBusRoute navigation={{ navigate: jest.fn() }} />
      </NavigationContainer>
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter single bus route number (e.g. 87)"),
      "88"
    );
    fireEvent.press(getByText("Fetch Stops"));
    fireEvent.press(getByText("Add Route"));
    setTimeout(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Dashboard");
    }, 500);
  });
});
