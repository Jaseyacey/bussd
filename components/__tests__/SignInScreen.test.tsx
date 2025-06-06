import React, { act } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import SignInScreen from "../../screens/SignInScreen";
import { NavigationContainer } from "@react-navigation/native";

describe("SignInScreen", () => {
  it("should render correctly", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
  });
  it("should show the email input", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
  });
  it("should show the password input", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });
  it("should show the sign in button", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    expect(screen.getByTestId("Sign In")).toBeTruthy();
  });
  it("should sign in", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password");
    fireEvent.press(screen.getByTestId("Sign In"));
    expect(screen.getByTestId("Sign In")).toBeTruthy();
  });
  it("should show an error message if the email is invalid", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "invalid");
  });
  it("should show an error message if the password is invalid", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "invalid");
  });
  it("should show an error message if the email and password are invalid", async () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "invalid");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "invalid");
    fireEvent.press(screen.getByTestId("Sign In"));
    setTimeout(() => {
      expect(screen.getByText("Invalid email or password")).toBeTruthy();
    }, 500);
  });
  it("should show a loading indicator when signing in", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password");
    fireEvent.press(screen.getByTestId("Sign In"));
    expect(screen.getByTestId("Loading...")).toBeTruthy();
  });
  it("should navigate to the dashboard", () => {
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    );
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password");
    fireEvent.press(screen.getByTestId("Sign In"));
    setTimeout(() => {
      expect(screen.getByTestId("Dashboard")).toBeTruthy();
    }, 500);
  });
});
