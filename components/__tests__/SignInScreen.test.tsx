import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import SignInScreen from "../../screens/SignInScreen";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe("SignInScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all UI elements correctly", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    expect(screen.getByText("Welcome Back")).toBeTruthy();
    expect(screen.getByText("Sign in to continue")).toBeTruthy();
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByTestId("Sign In")).toBeTruthy();
    expect(screen.getByText("Sign up")).toBeTruthy();
    expect(screen.getByText("Forgot Password?")).toBeTruthy();
  });

  it("handles email input correctly", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("handles password input correctly", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "password123");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("shows loading state during sign in", async () => {
    mockedAxios.post.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123"
    );
    fireEvent.press(screen.getByTestId("Sign In"));

    expect(screen.getByTestId("Loading...")).toBeTruthy();
  });

  it("navigates to Dashboard on successful sign in", async () => {
    const mockResponse = {
      data: {
        user: {
          id: "test-uuid",
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123"
    );
    fireEvent.press(screen.getByTestId("Sign In"));

    await screen.findByTestId("Loading...");

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/supabase/auth/signin"),
      {
        email: "test@example.com",
        password: "password123",
      }
    );

    expect(mockNavigate).toHaveBeenCalledWith("Dashboard", {
      email: "test@example.com",
      user_uuid: "test-uuid",
    });
  });

  it("handles sign in error correctly", async () => {
    const mockError = new Error("Sign in failed");
    mockedAxios.post.mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, "log");

    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "wrong-password"
    );
    fireEvent.press(screen.getByTestId("Sign In"));

    await screen.findByTestId("Loading...");

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    consoleSpy.mockRestore();
  });

  it("navigates to Auth screen when Sign up is pressed", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    fireEvent.press(screen.getByText("Sign up"));
    expect(mockNavigate).toHaveBeenCalledWith("Auth");
  });

  it("calls forgot password function when Forgot Password is pressed", () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );

    fireEvent.press(screen.getByText("Forgot Password?"));
    expect(consoleSpy).toHaveBeenCalledWith("Forgot Password");

    consoleSpy.mockRestore();
  });
});
