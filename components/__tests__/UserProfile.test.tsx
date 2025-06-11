import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import UserProfileScreen from "../../screens/UserProfileScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/Navigation/MainNavigator";

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

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

global.fetch = jest.fn();

describe("UserProfileScreen", () => {
  let mockNavigation: StackNavigationProp<RootStackParamList, "UserProfile">;
  let mockRoute: { key: string; name: "UserProfile"; params: undefined };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigation = {
      navigate: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
      isFocused: jest.fn(),
      canGoBack: jest.fn(),
      getId: jest.fn(),
      getParent: jest.fn(),
      getState: jest.fn(),
      setOptions: jest.fn(),
      setParams: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as any;

    mockRoute = {
      key: "UserProfile",
      name: "UserProfile" as const,
      params: undefined,
    };

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue(mockRoute);

    (global.fetch as jest.Mock).mockReset();
  });

  it("renders the header", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ routes: [] }),
      })
    );

    const { getByText } = render(
      <NavigationContainer>
        <UserProfileScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );
    expect(getByText("Settings")).toBeTruthy();
  });
  it("renders the menu items", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserProfileScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );
    expect(getByText("Logout")).toBeTruthy();
    expect(getByText("Delete Account")).toBeTruthy();
    expect(getByText("Privacy Policy")).toBeTruthy();
    expect(getByText("Terms of Service")).toBeTruthy();
    expect(getByText("Contact Us")).toBeTruthy();
    expect(getByText("About Us")).toBeTruthy();
    expect(getByText("Feedback")).toBeTruthy();
    expect(getByText("Help")).toBeTruthy();
    expect(getByText("Share")).toBeTruthy();
  });
  it("navigates to the screen when pressed", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserProfileScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );
    fireEvent.press(getByText("Logout"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignInScreen");
    fireEvent.press(getByText("Delete Account"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("DeleteAccount");
    fireEvent.press(getByText("Privacy Policy"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("PrivacyPolicy");
    fireEvent.press(getByText("Terms of Service"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("TermsOfService");
    fireEvent.press(getByText("Contact Us"));
  });
});
