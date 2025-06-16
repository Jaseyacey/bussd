import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import SplashScreen from "../../screens/Splashscreen";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../components/Navigation/MainNavigator";
import { trackEvent } from "../../src/lib/utils/amplitude";

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
  };
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("../../src/lib/utils/amplitude", () => ({
  trackEvent: jest.fn(),
}));

global.fetch = jest.fn();

describe("SplashScreen", () => {
  let mockNavigation: Partial<NavigationProp<RootStackParamList>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigation = {
      navigate: jest.fn(),
    };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    (global.fetch as jest.Mock).mockReset();
  });

  it("renders initial loading state correctly", () => {
    const { getByText } = render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    expect(getByText("Buss'd")).toBeTruthy();
    expect(getByText("How many bus routes have you taken?")).toBeTruthy();
  });

  it("navigates to Dashboard when user is logged in", async () => {
    process.env.EXPO_PUBLIC_URL = "http://test-api.com";

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isLoggedIn: true,
            session: {
              user: {
                email: "test@example.com",
                id: "test-uuid",
              },
            },
          }),
      })
    );

    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Dashboard", {
        email: "test@example.com",
        user_uuid: "test-uuid",
      });
    });
  });

  it("navigates to Auth when user is not logged in", async () => {
    process.env.EXPO_PUBLIC_URL = "http://test-api.com";

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isLoggedIn: false,
          }),
      })
    );

    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth");
    });
  });

  it("navigates to Auth when API call fails", async () => {
    process.env.EXPO_PUBLIC_URL = "http://test-api.com";

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth");
    });
  });

  it("handles missing API_URL correctly", async () => {
    process.env.EXPO_PUBLIC_URL = undefined;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error checking login status:",
        "Cannot read properties of undefined (reading 'ok')"
      );
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth");
    });

    consoleSpy.mockRestore();
  });

  it("handles non-ok response from API correctly", async () => {
    process.env.EXPO_PUBLIC_URL = "http://test-api.com";

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: "Internal Server Error",
      })
    );

    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth");
    });
  });
  it("tracks splash screen loaded event", () => {
    render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );
    expect(trackEvent).toHaveBeenCalledWith("splash_screen_loaded");
  });
});
