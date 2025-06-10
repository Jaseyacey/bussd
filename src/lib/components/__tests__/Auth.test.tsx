import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "../Auth";
import { Alert } from "react-native";

// Mock navigation
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

// Mock fetch
global.fetch = jest.fn();

// Mock Alert
jest.spyOn(Alert, "alert");

describe("Auth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all UI elements correctly", () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    expect(screen.getByText("Create Account")).toBeTruthy();
    expect(screen.getByText("Sign up to get started")).toBeTruthy();
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
    expect(screen.getByText("Already have an account? Sign in")).toBeTruthy();
  });

  it("handles email input correctly", () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("handles password input correctly", () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "Password123!");
    expect(passwordInput.props.value).toBe("Password123!");
  });

  it("handles confirm password input correctly", () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    fireEvent.changeText(confirmPasswordInput, "Password123!");
    expect(confirmPasswordInput.props.value).toBe("Password123!");
  });

  it("shows validation errors for empty fields", async () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const signUpButton = screen.getByText("Sign Up");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeTruthy();
      expect(screen.getByText("Password is required")).toBeTruthy();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "invalid-email");

    const signUpButton = screen.getByText("Sign Up");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeTruthy();
    });
  });

  it("shows validation error for password mismatch", async () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.changeText(passwordInput, "Password123!");
    fireEvent.changeText(confirmPasswordInput, "DifferentPassword123!");

    const signUpButton = screen.getByText("Sign Up");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeTruthy();
    });
  });

  it("navigates to SignInScreen when clicking sign in link", () => {
    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    const signInLink = screen.getByText("Already have an account? Sign in");
    fireEvent.press(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith("SignInScreen");
  });

  it("handles successful sign up and navigation", async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          user: { email: "test@example.com", id: "test-uuid" },
        }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    // Fill in the form
    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "Password123!"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm Password"),
      "Password123!"
    );

    // Submit the form
    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Sign up successful",
        "Your account has been created. You can now sign in."
      );
    });
  });

  it("handles sign up error", async () => {
    const mockResponse = {
      ok: false,
      text: () => Promise.resolve("Sign up failed"),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    // Fill in the form
    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "Password123!"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm Password"),
      "Password123!"
    );

    // Submit the form
    fireEvent.press(screen.getByText("Sign Up"));

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Sign up failed");
    }, 1000);
  });

  it("shows loading state during sign up", async () => {
    // Make fetch take some time to resolve
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    );

    // Fill in the form
    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "Password123!"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm Password"),
      "Password123!"
    );

    // Submit the form
    fireEvent.press(screen.getByText("Sign Up"));

    expect(screen.getByTestId("Loading...")).toBeTruthy();
  });
});
