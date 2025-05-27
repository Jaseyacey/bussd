import React from "react";
import { render, screen } from "@testing-library/react-native";
import SplashScreen from "../../screens/Splashscreen";

describe("SplashScreen", () => {
  it("should render correctly and display splash screen text", () => {
    render(<SplashScreen />);
    expect(screen.getByText("Splash Screen")).toBeDefined();
    expect(screen.getByText("This is the splash screen.")).toBeDefined();
    expect(screen.getByText("Loading resources...")).toBeDefined();
    expect(screen.getByText("Please wait...")).toBeDefined();
  });
});
