module.exports = {
  preset: "jest-expo",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|@react-native-community" +
      "|expo" +
      "|expo-modules-core" +
      "|native-base" +
      "|sentry-expo" +
      "|react-native-svg" +
      ")/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
